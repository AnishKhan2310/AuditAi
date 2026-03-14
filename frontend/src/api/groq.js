const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Analyzes text input using Groq API and extracts negative/risk clauses
 * @param {string} text - The text to analyze
 * @returns {Promise<Array>} - Array of negative clauses
 */
export const analyzeText = async (text) => {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not configured. Please add your API key to the .env file.');
  }

  try {
    // Create the prompt for extracting all types of clauses with solutions
    const prompt = `You are a legal document analyzer. Analyze the provided document and identify all clauses, categorizing them as NEGATIVE (risky/harmful), POSITIVE (safe/beneficial), or NEUTRAL (standard/informational).

For each clause found, provide a JSON response with the following structure:
{
  "clauses": [
    {
      "id": 1,
      "text": "The exact clause text from the document",
      "sentiment": "negative", // or "positive" or "neutral"
      "category": "Appropriate category (e.g., Legal, Financial, Access Control, Governance, Privacy, Security, Compliance)",
      "solution": "If sentiment is negative, provide a clear solution/recommendation on how to fix or rewrite this clause to make it safe. If not negative, leave as empty string."
    }
  ]
}

IMPORTANT:
1. Include clauses with ALL sentiment types: "negative", "positive", and "neutral"
2. For NEGATIVE clauses, provide a practical SOLUTION explaining how to fix or rewrite the clause to make it safe
3. Extract the EXACT text from the document
4. Assign an appropriate category
5. The response MUST be valid JSON
6. Do not include any additional text outside the JSON structure
7. If no clauses are found, return an empty array: {"clauses": []}
8. Try to identify at least 10-15 total clauses if possible

Now analyze this document and provide the JSON response:

${text}`;

    // Prepare the request body for Groq API
    const requestBody = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 8000,
      stream: false
    };

    // Make the API call
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to analyze text");
    }

    const data = await response.json();
    
    // Extract the text response from Groq
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("No response from Groq API");
    }

    // Parse the JSON response - find the JSON block in the response
    // Handle cases where AI returns extra text around the JSON
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from Groq API");
    }

    // Try to find the clauses array more specifically
    const clausesMatch = responseText.match(/"clauses"\s*:\s*\[[\s\S]*\]/);
    if (clausesMatch) {
      try {
        const parsedResponse = JSON.parse('{' + clausesMatch[0] + '}');
        return parsedResponse.clauses || [];
      } catch (e) {
        // Fall through to general parsing
      }
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Return the clauses array
    return parsedResponse.clauses || [];
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};

/**
 * Analyzes a PDF document using Groq API and extracts negative/risk clauses
 * Uses PDF.js to extract text from PDF first
 * @param {File} pdfFile - The PDF file to analyze
 * @returns {Promise<Array>} - Array of negative clauses
 */
export const analyzePDF = async (pdfFile) => {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY is not configured. Please add your API key to the .env file.');
  }

  try {
    // Read PDF as text using FileReader and PDF.js
    const pdfText = await readPDFAsText(pdfFile);
    
    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error("Could not extract text from PDF. Please try pasting the text directly.");
    }

    // Now analyze the extracted text
    return await analyzeText(pdfText);
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw error;
  }
};

/**
 * Reads a PDF file and extracts text content using PDF.js
 * @param {File} pdfFile - The PDF file to read
 * @returns {Promise<string>} - Extracted text from PDF
 */
const readPDFAsText = async (pdfFile) => {
  // Dynamically import pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist');
  
  // Use the worker from node_modules (Vite will handle this)
  const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + "\n";
        }
        
        resolve(fullText);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error("Failed to read PDF file"));
    
    reader.readAsArrayBuffer(pdfFile);
  });
};
