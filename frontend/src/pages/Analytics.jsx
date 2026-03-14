import Sidebar from "../components/Sidebar"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function Analytics() {
  const [tab, setTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [auditData, setAuditData] = useState(null)
  const [expandedSolution, setExpandedSolution] = useState(null)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  // Check if user can access solutions (Growth or Enterprise plan)
  const canAccessSolution = user?.plan && user.plan !== "Starter"

  // FETCH ANALYSIS DATA FROM LOCALSTORAGE (Set by Dashboard)
  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setLoading(true)
        
        // Get the analysis results from localStorage (set by Dashboard)
        const storedClauses = localStorage.getItem("auditClauses")
        const storedDate = localStorage.getItem("auditDate")
        const storedDocName = localStorage.getItem("documentName")
        
        if (!storedClauses) {
          // No data found - show empty state
          setAuditData(null)
          setLoading(false)
          return
        }
        
        const rawClauses = JSON.parse(storedClauses)
        const documentName = storedDocName || "Document"
        const analysisDate = storedDate ? new Date(storedDate).toLocaleDateString() : new Date().toLocaleDateString()

        // --- PROCESS THE RAW DATA INTO DASHBOARD STATS ---
        // Groq now returns all clause types: negative, positive, neutral
        const total = rawClauses.length
        const risk = rawClauses.filter(c => c.sentiment === "negative").length
        const safe = rawClauses.filter(c => c.sentiment === "positive").length
        const neutral = rawClauses.filter(c => c.sentiment === "neutral").length
        
        // Calculate percentages
        const negativeScore = total > 0 ? Math.round((risk / total) * 100) : 0
        const safeScore = total > 0 ? Math.round((safe / total) * 100) : 0
        const neutralScore = total > 0 ? Math.round((neutral / total) * 100) : 0

        // Group by category to build the category cards dynamically
        const categoryMap = {}
        rawClauses.forEach(clause => {
          if (!categoryMap[clause.category]) {
            categoryMap[clause.category] = { total: 0, risk: 0, safe: 0, neutral: 0 }
          }
          categoryMap[clause.category].total += 1
          if (clause.sentiment === "negative") {
            categoryMap[clause.category].risk += 1
          } else if (clause.sentiment === "positive") {
            categoryMap[clause.category].safe += 1
          } else {
            categoryMap[clause.category].neutral += 1
          }
        })

        const categories = Object.keys(categoryMap).map((key, index) => ({
          id: index,
          name: key,
          count: categoryMap[key].total,
          text: categoryMap[key].risk === 0 ? "All clear" : `${categoryMap[key].risk} risk · ${categoryMap[key].total} total`,
          color: categoryMap[key].risk === 0 ? "green" : "red"
        }))

        // Filter out only the negative ones for the risk tab
        const negativeAudits = rawClauses.filter(c => c.sentiment === "negative")

        // Set the processed data into our state
        setAuditData({
          negativeScore,
          stats: { total, risk, safe, neutral },
          clausePercentages: { risk: negativeScore, safe: safeScore, neutral: neutralScore },
          categories,
          negativeAudits,
          documentName,
          analysisDate
        })

      } catch (err) {
        console.error("Failed to fetch audit data", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditData()
  }, [])

  // LOADING STATE UI
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-[2px] bg-yellow-50 flex flex-col items-center justify-center bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="w-16 h-16 border-4 border-yellow-950 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-yellow-950 font-bold animate-pulse">Consulting AI... Analyzing Contract...</p>
        </div>
      </div>
    )
  }

  if (!auditData) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-[2px] bg-yellow-50 flex flex-col items-center justify-center bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="text-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-950 mb-2">No Analysis Yet</h2>
            <p className="text-yellow-950/70 mb-6">Upload a document from the Dashboard to see your first analysis.</p>
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="bg-yellow-950 text-white px-6 py-3 rounded-xl font-medium hover:bg-yellow-800 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* UNIVERSAL SIDEBAR */}
      <Sidebar />
  
      {/* PAGE */}
      <div className="flex-1 ml-[2px] bg-yellow-50 overflow-y-auto p-10 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="max-w-6xl">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-yellow-950">
                Documents · {auditData.documentName}
              </p>
              <div className="flex gap-2">
              <h1 className="text-3xl font-bold mt-1 text-yellow-950">
                Analytics
                
              </h1>
              <lord-icon
              className=""
              src="https://cdn.lordicon.com/ufsihzjz.json"
              trigger="hover"
              color="primary:#17171c,secondary:#3583ff,tertiary:#f4f19c"
              style={{ width: "48px", height: "48px" }}
            ></lord-icon>
            </div>
              <p className="text-sm text-yellow-950">
                Analysed on {auditData.analysisDate || new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="bg-yellow-100 rounded-xl p-4 flex items-center gap-3 shadow-sm border-2 border-yellow-950 flex flex-col items-center">
              <div className="bg-white p-2 rounded">📄</div>
              <div>
                <p className="font-semibold text-sm text-center">
                  {auditData.documentName}
                </p>
                <p className="text-xs text-yellow-950 text-center mt-1">
                  {auditData.stats.total} negative clauses identified
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Stat label="TOTAL CLAUSES" value={auditData.stats.total} sub="identified by AI" />
            <Stat label="RISK CLAUSES" value={auditData.stats.risk} color="text-red-500" sub="need attention" />
            <Stat label="SAFE CLAUSES" value={auditData.stats.safe} color="text-green-500" sub="no action needed" />
            <Stat label="NEUTRAL CLAUSES" value={auditData.stats.neutral} sub="review optional" />
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-6">
            <Tab name="overview" label="Overview" tab={tab} setTab={setTab} />
            <Tab name="risk" label={`Risk Clauses (${auditData.stats.risk})`} tab={tab} setTab={setTab} />
          </div>

          {/* OVERVIEW TAB CONTENT */}
          {tab === "overview" && (
            <div className="grid grid-cols-3 gap-6">
              {/* RISK SCORE */}
              <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950 flex flex-col items-center">
                <p className="text-xs text-yellow-950 mb-4 font-bold">NEGATIVE SCORE</p>
                <div className="flex justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="rotate-[-90deg]" width="160" height="160">
                      <circle cx="80" cy="80" r="65" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        stroke="#ef4444"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray="408"
                        strokeDashoffset={408 - (408 * auditData.negativeScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-4xl font-bold">{auditData.negativeScore}%</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-red-500 font-semibold mt-4">Risk Detected</p>
                
                {/* Legend */}
                <div className="mt-6 space-y-2 text-sm w-full px-4">
                  <Legend color="bg-red-500" label="Negative" value={auditData.stats.risk} />
                  <Legend color="bg-green-500" label="Positive" value={auditData.stats.safe} />
                  <Legend color="bg-gray-400" label="Neutral" value={auditData.stats.neutral} />
                </div>
              </div>

              {/* CLAUSE BREAKDOWN */}
              <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950">
                <p className="text-xs text-yellow-950 mb-4 font-bold">CLAUSE BREAKDOWN</p>
                <Bar label="Risk clauses" value={auditData.clausePercentages.risk} color="bg-red-500" />
                <Bar label="Safe clauses" value={auditData.clausePercentages.safe} color="bg-green-500" />
                <Bar label="Neutral clauses" value={auditData.clausePercentages.neutral} color="bg-gray-400" />
                <div className="flex mt-6 h-2 rounded-full overflow-hidden">
                  <div className={`bg-red-500`} style={{ width: `${auditData.clausePercentages.risk}%` }} />
                  <div className={`bg-green-500`} style={{ width: `${auditData.clausePercentages.safe}%` }} />
                  <div className={`bg-gray-400`} style={{ width: `${auditData.clausePercentages.neutral}%` }} />
                </div>
              </div>

              {/* CATEGORY */}
              <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950 overflow-y-auto max-h-[400px]">
                <p className="text-xs text-yellow-950 mb-4 font-bold">BY CATEGORY</p>
                <div className="grid grid-cols-2 gap-4">
                  {auditData.categories.map((cat) => (
                    <Category key={cat.id} name={cat.name} count={cat.count} text={cat.text} color={cat.color} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RISK TAB CONTENT */}
          {tab === "risk" && (
            <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border-2 border-yellow-950">
              <h2 className="text-xl font-bold text-yellow-950 mb-6">Identified Risk Clauses</h2>
              {auditData.negativeAudits.length === 0 ? (
                <p className="text-yellow-950/70">Great news! No high-risk clauses were detected in this document.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {auditData.negativeAudits.map((audit) => (
                    <div key={audit.id} className="bg-white p-5 rounded-xl border-2 border-red-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {audit.category}
                        </span>
                        {audit.solution && (
                          <button
                            onClick={() => {
                              if (canAccessSolution) {
                                setExpandedSolution(expandedSolution === audit.id ? null : audit.id)
                              } else {
                                navigate("/billing")
                              }
                            }}
                            className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                              canAccessSolution 
                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            title={canAccessSolution ? "" : "Upgrade to Growth or Enterprise to access solutions"}
                          >
                            {canAccessSolution 
                              ? (expandedSolution === audit.id ? "Hide Solution" : "View Solution") 
                              : "Upgrade to View"
                            }
                          </button>
                        )}
                      </div>
                      <p className="text-yellow-950 font-medium leading-relaxed">
                        {audit.text}
                      </p>
                      {expandedSolution === audit.id && audit.solution && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-bold text-green-800 mb-2">Recommended Solution:</p>
                          <p className="text-sm text-green-700 leading-relaxed">
                            {audit.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* COMPONENTS */

function Stat({ label, value, sub, color }) {
  return (
    <div className="bg-yellow-100 rounded-2xl p-6 shadow-sm border-2 border-yellow-950 flex flex-col items-center text-center">
      <p className="text-xs text-yellow-950 font-bold">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color || "text-yellow-950"}`}>
        {value}
      </p>
      <p className="text-sm text-yellow-950 mt-1">{sub}</p>
    </div>
  )
}

function Tab({ name, label, tab, setTab }) {
  return (
    <button
      onClick={() => setTab(name)}
      className={`px-5 py-2 rounded-xl text-sm font-medium border-2 border-yellow-950 transition-colors ${
        tab === name
          ? "bg-yellow-950 text-white"
          : "bg-yellow-100 text-yellow-950 hover:bg-yellow-200"
      }`}
    >
      {label}
    </button>
  )
}

function Bar({ label, value, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1 font-medium text-yellow-950">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-white border border-yellow-950/20 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Category({ name, count, text, color }) {
  return (
    <div className="border-2 border-yellow-950/20 bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-yellow-950">{name}</p>
        <div className={`w-3 h-3 rounded-full ${color === "red" ? "bg-red-500" : "bg-green-500"}`} />
      </div>
      <p className="text-2xl font-bold mt-2 text-yellow-950">{count}</p>
      <p className={`text-xs mt-1 font-medium ${color === "red" ? "text-red-500" : "text-green-500"}`}>
        {text}
      </p>
    </div>
  )
}

function Legend({ color, label, value }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <p className="text-yellow-950 font-medium">{label}</p>
      </div>
      <p className="font-bold text-yellow-950">{value}</p>
    </div>
  )
}
