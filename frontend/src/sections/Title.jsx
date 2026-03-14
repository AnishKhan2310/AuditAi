import { useNavigate } from "react-router-dom"

export default function Title() {

 const navigate = useNavigate()

 const handleStart = () => {
  navigate("/login")
 }

 return (

  <div className="w-full mb-9 flex flex-col items-center mt-12">

   <h1 className="text-[100px] font-serif hover:scale-110 transition-transform">
    <span className="text-yellow-300">&lt;</span>
    Audit.Ai
    <span className="text-yellow-300">/&gt;</span>
   </h1>

   <h2 className="text-[30px] font-serif">
    Contract Terms of Service Humanizer
   </h2>

   <button
    onClick={handleStart}
    className="bg-yellow-950 text-white font-bold py-2 px-4 rounded my-6 hover:bg-yellow-200 hover:text-yellow-950 transition hover:scale-110 duration-300"
   >
    Get Started
   </button>

   <div className="w-[75vw] h-[2px] bg-yellow-950 mt-5"></div>

  </div>

 )

}