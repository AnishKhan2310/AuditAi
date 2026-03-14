import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"


import api from "../api/axios"
import { useAuthStore } from "../store/authStore"

export default function AuthPage() {
  const navigate = useNavigate() 
  const [tab, setTab] = useState("login")

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")

  const setAuth = useAuthStore((s) => s.setAuth)



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

    setErrors({
      ...errors,
      [e.target.name]: ""
    })

  }



  const validateForm = () => {

    const newErrors = {}

    if (tab === "signup" && !form.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    }
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    }
    else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }



  const handleSubmit = async (e) => {

    e.preventDefault()

    setServerError("")

    if (!validateForm()) return

    setLoading(true)

    try {

      const endpoint =
        tab === "login"
          ? "/auth/login"
          : "/auth/signup"

      const res = await api.post(endpoint, form)

      const { accessToken, user } = res.data

      setAuth(accessToken, user)

      navigate("/dashboard")

    }
    catch (err) {

      setServerError(
        err.response?.data?.message ||
        "Unable to authenticate. Please try again."
      )

    }

    setLoading(false)

  }



  const handleGoogleSuccess = async (credentialResponse) => {

    try {

      const res = await api.post(
        "/auth/google",
        { token: credentialResponse.credential }
      )

      const { accessToken, user } = res.data

      setAuth(accessToken, user)

      navigate("/dashboard")

    }
    catch (err) {
      setServerError("Google authentication failed. Try again.")
    }

  }



  const switchTab = (type) => {
    setTab(type)
    setErrors({})
    setServerError("")
  }



  return (

    <div className="flex items-center justify-center min-h-screen ">

      <div className="w-[420px] bg-yellow-100 rounded-2xl shadow-xl p-8">

        {/* Logo */}

        <div className="flex items-center gap-3 mb-6">

          <h1 className="text-[35px] font-serif cursor-pointer" onClick={() => navigate('/')}> <span className='text-yellow-300 '>&lt;</span>Audit.Ai<span className='text-yellow-300'>/&gt;</span></h1>

        </div>



        <h1 className="text-2xl font-bold mb-1">
          {tab === "login" ? "Welcome Back" : "Create Account"}
        </h1>



        <p className="text-yellow-950 mb-6 text-sm">

          {tab === "login" ? (

            <>
              Or{" "}
              <span
                onClick={() => switchTab("signup")}
                className="underline cursor-pointer"
              >
                create an account
              </span>{" "}
              to get started
            </>

          ) : (

            <>
              Already have an account?{" "}
              <span
                onClick={() => switchTab("login")}
                className="underline cursor-pointer"
              >
                Log in
              </span>
            </>

          )}

        </p>



        <div className="bg-yellow-50 rounded-full flex p-1 mb-6">

          <button
            onClick={() => switchTab("login")}
            className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === "login" ? "bg-yellow-950 text-white" : "text-gray-500"
              }`}
          >
            Log in
          </button>
<button
            onClick={() => switchTab("signup")}
            className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === "signup" ? "bg-yellow-950 text-white" : "text-gray-500"
              }`}
          >
            Sign up
          </button>

        </div>



        <div className="mb-6">

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setServerError("Google login failed")}
          />

        </div>



        <div className="flex items-center gap-3 mb-6">

          <div className="flex-1 h-px bg-yellow-50"></div>

          <span className="text-gray-400 text-sm">
            Or continue with email
          </span>

          <div className="flex-1 h-px bg-yellow-50"></div>

        </div>



        <form onSubmit={handleSubmit}>



          {tab === "signup" && (

            <div className="mb-4">

              <label className="text-sm font-medium">Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Your name"
                className="w-full mt-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}

            </div>

          )}



          <div className="mb-4">

            <label className="text-sm font-medium">Email</label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="user@gmail.com"
              className="w-full mt-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-950"
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}

          </div>



          <div className="mb-6">

            <label className="text-sm font-medium">Password</label>

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-950"
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}

          </div>



          {serverError && (
            <p className="text-red-500 text-sm mb-4">{serverError}</p>
          )}



          <button
            disabled={loading}
            className="w-full bg-yellow-950 text-yellow-50 py-3 rounded-xl font-medium hover:opacity-90"
          >

            {loading
              ? "Please wait..."
              : tab === "login"
                ? "Sign in to Dashboard"
                : "Create Account"}

          </button>

        </form>

      </div>

    </div>

  )
}