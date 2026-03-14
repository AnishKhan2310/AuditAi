import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { FileText, ArrowRight, Search, Trash2 } from "lucide-react"

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch History from localStorage
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        
        // Get history from localStorage
        const storedHistory = localStorage.getItem("history")
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory))
        } else {
          setHistory([])
        }
      } catch (err) {
        console.error("Failed to fetch history:", err)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistory()
  }, [])

  // Delete a history item
  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this analysis?")) {
      const updatedHistory = history.filter(doc => doc.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem("history", JSON.stringify(updatedHistory))
    }
  }

  // Navigate to analytics with the selected document
  const handleViewReport = (doc) => {
    // Save the selected document data to localStorage for Analytics to load
    localStorage.setItem("auditClauses", JSON.stringify(doc.clauses))
    localStorage.setItem("auditDate", doc.createdAt)
    localStorage.setItem("documentName", doc.originalName)
    navigate("/analytics")
  }

  // Filter the history based on search query
  const filteredHistory = history.filter((doc) =>
    doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden bg-yellow-50 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex gap-2 items-center"><h1 className="text-3xl font-bold text-yellow-950 mb-2">Audit History</h1>
              <lord-icon
    src="https://cdn.lordicon.com/nnhjoynp.json"
    trigger="hover"
    style={{ width: "50px", height: "50px" }}
  ></lord-icon>
              </div>
              
              <p className="text-yellow-950/70">View and manage your previously analyzed contracts.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-950/40" size={18} />
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border-2 border-yellow-950/20 bg-white focus:outline-none focus:border-yellow-950 text-sm w-64 transition-colors"
              />
            </div>
          </div>

          {/* History Table/List */}
          <div className="bg-white rounded-2xl border-2 border-yellow-950/20 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-10 flex flex-col gap-4">
                <div className="h-16 bg-yellow-950/5 animate-pulse rounded-xl w-full"></div>
                <div className="h-16 bg-yellow-950/5 animate-pulse rounded-xl w-full"></div>
                <div className="h-16 bg-yellow-950/5 animate-pulse rounded-xl w-full"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="p-10 text-center text-yellow-950/60">
                <p>No documents found. Head over to the Dashboard to upload your first contract!</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-10 text-center text-yellow-950/60">
                <p>No documents found matching "{searchQuery}"</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-yellow-100/50 border-b-2 border-yellow-950/10 text-sm text-yellow-950/70">
                    <th className="p-4 font-semibold">Document Name</th>
                    <th className="p-4 font-semibold">Date Uploaded</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Safety Score</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className="border-b border-yellow-950/10 hover:bg-yellow-50 transition group cursor-pointer"
                      onClick={() => handleViewReport(doc)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-950">
                            <FileText size={18} />
                          </div>
                          <span className="font-medium text-yellow-950">{doc.originalName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-yellow-950/70">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          doc.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-yellow-950">
                        {doc.score ? `${doc.score}/100` : '--'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => handleDelete(e, doc.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleViewReport(doc)}
                            disabled={doc.status !== 'completed'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                              doc.status === 'completed' 
                                ? 'bg-yellow-950 text-white hover:bg-yellow-800' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            View Report <ArrowRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
