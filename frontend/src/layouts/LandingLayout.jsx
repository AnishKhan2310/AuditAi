import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function LandingLayout() {

 return (

  <div className="min-h-screen bg-yellow-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-yellow-950">

   <Navbar />

   <Outlet />

   <Footer />

  </div>

 )

}