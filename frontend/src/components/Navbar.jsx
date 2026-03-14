import { useNavigate } from "react-router-dom"

export default function Navbar() {

 const navigate = useNavigate()

 return (

  <nav className="w-full h-[8vh] bg-yellow-950 text-white flex items-center justify-between px-6">

   <div className="flex items-center gap-2 ml-10">

    <h1 className="text-3xl font-serif">
     <span className="text-yellow-300">&lt;</span>
     Audit.Ai
     <span className="text-yellow-300">/&gt;</span>
    </h1>

   </div>

   <button
    onClick={()=>navigate("/login")}
    className="bg-yellow-100 py-2 px-5 text-yellow-950 font-bold rounded-3xl hover:scale-110 transition-transform"
   >
    Sign In
   </button>

  </nav>

 )

}