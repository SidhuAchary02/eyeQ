import { useContext, useState } from "react"
import { Eye, EyeOff, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logow from "../../assets/logow.png"
import google from "../../assets/google.png"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const {setUser} = useContext(AuthContext)

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await axios.post("http://localhost:8000/auth/login",
                { email, password },
                { withCredentials: true });
            console.log("Login successful:", data);
            setUser(data.data);
            navigate("/dashboard");

        } catch (error) {
            console.log("login failed", error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1c1c1c] to-[#0b0b0b] relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 1200 800">
                    <defs>
                        <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" strokeWidth="1" />
                            <circle cx="50" cy="50" r="3" fill="white" />
                            <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="0.5" opacity="0.5" />
                            <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="0.5" opacity="0.5" />
                        </pattern>
                    </defs>
                    <rect width="1200" height="800" fill="url(#tech-pattern)" />
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-xs border border-zinc-700 bg-zinc-900 rounded-2xl shadow-lg p-8 w-full">
                {/* Logo */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <a href="/" className="w-8 h-8 rounded flex items-center justify-center">
                            <img src={logow} alt="eyeQ logo" />
                        </a>
                        <span className="text-white text-2xl font-bold">eye<span className="text-amber-600">Q</span> login</span>
                        <span></span>
                    </div>

                    {/* Welcome Heading */}
                    {/* <h1 className="text-white text-3xl font-bold mb-2">Welcome! 👋</h1> */}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Email Field */}
                    <div>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400 transition"
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    {/* Continue Button */}
                    <button
                        type="submit"
                        disabled={!(email && password)}
                        className="w-full px-2 py-1.5 bg-[#F2F0EF] text-black font-bold rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </form>

                {/* <div className="flex items-center gap-1 my-3">
                    <div className="flex-1 border-t border-gray-700"></div>
                    <span className="text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-700"></div>
                </div>

                <button className="w-full px-4 py-3 border border-zinc-700 bg-zinc-900 text-white font-semibold rounded-lg flex items-center justify-center gap-3 transition cursor-pointer">
                    <img src={google} width={14} alt="google icon" />
                    Continue with Google
                </button>  */}

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/signup")
                        }}
                        className="text-[#949392] transition"
                    >
                        don't have account <span className="font-semibold text-[#F2F0EF] underline">Signup</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
