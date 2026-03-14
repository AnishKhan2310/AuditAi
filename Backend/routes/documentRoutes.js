import express from "express";
import fs from "fs";
import upload from "../middleware/upload.js"; 
import Document from "../models/Document.js"; 

const router = express.Router();

// 1. UPLOAD ROUTE (You already have this)
router.post('/submit', upload.single('pdf'), async (req, res) => {
  try {
    const textInput = req.body.text; 
    const uploadedFile = req.file;   

    if (!uploadedFile && !textInput) {
      return res.status(400).json({ error: "Please provide either a PDF or text content." });
    }

    let newDocument;

    if (textInput && !uploadedFile) {
      console.log("Received raw text. Saving to DB...");
      newDocument = await Document.create({
        filename: `Text-Snippet-${Date.now()}`,
        originalName: "Pasted Text",
        uploadType: 'text',
        textContent: textInput,
        status: 'processing'
      });
      return res.status(200).json({ message: "Text received.", documentId: newDocument._id });
    }

    if (uploadedFile) {
      console.log("Received file:", uploadedFile.filename);
      newDocument = await Document.create({
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalname,
        uploadType: 'pdf',
        status: 'processing'
      });
      return res.status(200).json({ message: "PDF uploaded.", documentId: newDocument._id });
    }

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process document upload." });
  }
});


// 👇 2. NEW HISTORY ROUTE 👇
router.get('/history', async (req, res) => {
  try {
    // Fetch all documents, sorted by newest first
    // Note: Once you add user authentication to routes, you would filter by userId here: { userId: req.user.id }
    const history = await Document.find().sort({ createdAt: -1 }); 
    
    res.status(200).json(history);
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Failed to fetch document history." });
  }
});

export default router;