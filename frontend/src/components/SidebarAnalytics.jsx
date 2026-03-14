import { useAuthStore } from "../store/authStore"
import api from "../api/axios"
import { useNavigate, useLocation } from "react-router-dom"
import { Upload, BarChart3, LogOut } from "lucide-react"

export default function SidebarAnalytics() {

 const { user, logout } = useAuthStore()
 const navigate = useNavigate()
 const location = useLocation()

 const handleLogout = async () => {
  try{
   await api.post("/auth/logout")
   logout()
   navigate("/")
  }
  catch(err){
   console.log(err)
  }
 }

 const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`

 const menu = [
  {
   name:"Upload",
   icon: Upload,
   path:"/dashboard"
  },
  {
   name:"Analytics",
   icon: BarChart3,
   path:"/analytics"
  }
 ]

 return (

<div className="fixed left-0 top-0 w-[260px] h-screen bg-white border-r flex flex-col justify-between p-4">

{/* TOP */}

<div>

<h2 className="text-xl font-bold mb-8">
 Mini<span className="text-purple-500">Audit</span>
</h2>

<div className="flex flex-col gap-2">

{menu.map((item,index)=>{

 const Icon = item.icon
 const active = location.pathname === item.path

 return(

<button
 key={index}
 onClick={()=>navigate(item.path)}
 className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition font-medium
 ${
  active
  ? "bg-purple-500 text-white"
  : "text-gray-700 hover:bg-purple-100 hover:text-purple-600"
 }`}
>

<Icon size={18}/>
{item.name}

</button>

)

})}

</div>

</div>

{/* USER */}

<div className="flex items-center justify-between border-t pt-4">

<div className="flex items-center gap-3">

<img
 src={avatarUrl}
 alt="avatar"
 className="w-10 h-10 rounded-full"
/>

<p className="text-sm font-medium">
 {user?.email}
</p>

</div>

<button
 onClick={handleLogout}
 className="text-red-500 hover:text-red-600"
>
 <LogOut size={18}/>
</button>

</div>

</div>

 )
}