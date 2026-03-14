import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Sidebar from "../components/Sidebar"
import { analyzePDF, analyzeText } from "../api/groq"

export default function Dashboard() {

  const navigate = useNavigate()
  const [mode,setMode] = useState("pdf")
  const [file,setFile] = useState(null)
  const [text,setText] = useState("")
  const [loading,setLoading] = useState(false)

  const fileInputRef = useRef(null)

const handleUpload = async () => {

    if(mode === "pdf" && !file){
      return toast.error("Please upload a PDF")
    }

    if(mode === "text" && !text.trim()){
      return toast.error("Please enter text")
    }

    try{
      setLoading(true)

      let clauses = []

      if (mode === "pdf") {
        // Call Gemini API directly with PDF
        clauses = await analyzePDF(file)
      } else {
        // Call Gemini API directly with text
        clauses = await analyzeText(text)
      }

      // Store the analysis results in localStorage for Analytics page
      localStorage.setItem("auditClauses", JSON.stringify(clauses))
      localStorage.setItem("auditDate", new Date().toISOString())
      localStorage.setItem("documentName", mode === "pdf" ? file.name : "Text Input")

      // Also save to history
      const historyItem = {
        id: Date.now().toString(),
        originalName: mode === "pdf" ? file.name : "Text Input",
        status: "completed",
        createdAt: new Date().toISOString(),
        score: 100 - Math.round((clauses.filter(c => c.sentiment === "negative").length / clauses.length) * 100) || 100,
        clauses: clauses
      }

      // Get existing history
      const existingHistory = JSON.parse(localStorage.getItem("history") || "[]")
      // Add new item at the beginning
      const updatedHistory = [historyItem, ...existingHistory]
      localStorage.setItem("history", JSON.stringify(updatedHistory))

      toast.success("Analysis complete!")

      setFile(null)
      setText("")

      // Navigate to Analytics page
      navigate("/analytics")

    } catch(err){
      console.error("Analysis error:", err)
      
      if (err.message.includes("GROQ_API_KEY")) {
        toast.error(`Configuration Error: ${err.message}\n\nPlease add your Groq API key to the .env file.`)
      } else {
        toast.error(`Analysis failed: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="flex min-h-screen bg-yellow-50 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]">

      <Sidebar/>

      <div className="flex-1 flex items-center justify-center p-10">

        <div className="bg-yellow-100 w-[480px] rounded-2xl shadow-lg p-8 border-2 border-yellow-950">

          <h1 className="text-xl font-semibold mb-1">
            Upload document
          </h1>

          <p className="text-yellow-950 text-sm mb-6">
            PDF file or paste text directly
          </p>

          {/* Toggle */}
          <div className="flex bg-yellow-200 rounded-full p-1 mb-6">

            <button
              onClick={()=>setMode("pdf")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                mode==="pdf"
                ? "bg-yellow-950 text-white"
                : "text-yellow-950"
              }`}
            >
              Upload PDF
            </button>

            <button
              onClick={()=>setMode("text")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                mode==="text"
                ? "bg-yellow-950 text-white"
                : "text-yellow-950"
              }`}
            >
              Paste text
            </button>

          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e)=>setFile(e.target.files[0])}
            className="hidden"
          />

          {/* Upload Box */}
          <div
            onClick={()=> mode==="pdf" && fileInputRef.current.click()}
            className="border-2 border-yellow-950 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-yellow-200"
          >

            {/* Upload Icon */}
            {mode === "pdf" && (
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Upload size={24} className="text-yellow-950"/>
              </div>
            )}

            {mode === "pdf" && (
              <>
                <p className="font-medium">
                  {file ? file.name : "Drop your PDF here"}
                </p>

                <p className="text-sm text-yellow-950">
                  or click to browse your files
                </p>

                <p className="text-xs text-yellow-950">
                  PDF only · max 10 MB
                </p>
              </>
            )}

            {mode === "text" && (
              <textarea
                placeholder="Paste your text here..."
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className="w-full border rounded-lg p-3 h-32 text-sm border-yellow-950 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            )}

          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">

            <button
              onClick={handleUpload}
              className="bg-yellow-950 text-white px-8 py-2 rounded-lg hover:bg-yellow-800 transition"
            >
              {loading ? "Analyzing..." : "Continue"}
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}