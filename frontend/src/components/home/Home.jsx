import { Menu, X, Video, Shield, Zap, Code } from "lucide-react"
import { useContext, useState } from "react"
import logo from "../../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const {user} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleGetStarted = () => {
        if(user){
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] text-white">
            {/* Navigation */}
            <nav className="border-b border-gray-700 bg-[#fff] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="logo" width={40} />
                            <span className="text-xl font-bold tracking-tight text-black">eyeQ</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-gray-700 hover:text-gray-600 transition">
                                Home
                            </a>
                            <a href="https://github.com/SidhuAchary02/eyeQ" className="text-gray-700 hover:text-gray-600 transition">
                                Github
                            </a>
                            <a href="#" className="text-gray-700 hover:text-gray-600 transition">
                                Documentation
                            </a>
                            <a href="#" className="text-gray-700 hover:text-gray-600 transition">
                                Demo
                            </a>
                        </div>

                        {/* Login Button & Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="hidden md:block px-4 py-2 bg-[#2E3133] text-white rounded transition font-medium">
                                EyeQ Login
                            </button>
                            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="text-black" size={24} /> : <Menu className="text-black" size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-2">
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:text-gray-600">
                                Home
                            </a>
                            <a href="https://github.com/SidhuAchary02/eyeQ" className="block px-4 py-2 text-gray-700 hover:text-gray-600">
                                Github
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:text-gray-600">
                                Documentation
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:text-gray-600">
                                Demo
                            </a>
                            <a href="/login" className="w-fit px-4 py-2 bg-[#1a1a1a] text-white rounded hover:bg-black transition font-medium">
                                EyeQ Login
                            </a>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        {/* Headline */}
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
                                Monitor your security cameras with Processed AI
                            </h1>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                            <p>
                                EyeQ is an open source NVR built around real-time AI object detection. All processing is performed
                                locally on your own hardware, and your camera feeds never leave your home.
                            </p>
                            <p>Get access to custom models designed specifically for EyeQ with EyeQ.</p>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition text-lg">
                            Get Started
                        </button>
                    </div>

                    {/* Right Content - Camera Feed Preview */}
                    <div className="relative">
                        <div className="bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700">
                            {/* Sidebar Icons */}
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-black border-r border-gray-700 flex flex-col items-center py-4 gap-4 z-10">
                                <Video size={24} className="text-blue-500" />
                                <Shield size={20} className="text-gray-500 hover:text-white transition cursor-pointer" />
                                <Zap size={20} className="text-gray-500 hover:text-white transition cursor-pointer" />
                                <Code size={20} className="text-gray-500 hover:text-white transition cursor-pointer" />
                                <button className="mt-auto text-gray-500 hover:text-white transition text-2xl">+</button>
                            </div>

                            {/* Camera Feed Grid */}
                            <div className="ml-16 p-4">
                                {/* Top Row - 5 thumbnails */}
                                <div className="grid grid-cols-5 gap-2 mb-4">
                                    {[
                                        { time: "22m ago", delay: 0 },
                                        { time: "22m ago", delay: 1 },
                                        { time: "24m ago", delay: 2 },
                                        { time: "28m ago", delay: 3 },
                                        { time: "33m ago", delay: 4 },
                                    ].map((item, idx) => (
                                        <div key={idx} className="relative aspect-video bg-gray-900 rounded overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-green-900 to-gray-900 flex items-end p-2">
                                                <span className="text-xs text-white font-semibold">{item.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Row - 3 larger feeds */}
                                <div className="grid grid-cols-3 gap-2">
                                    {[{ label: "Backyard" }, { label: "Front Yard" }, { label: "Side Door" }].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-video bg-gray-900 rounded overflow-hidden border border-gray-700"
                                        >
                                            <div className="w-full h-full bg-gradient-to-br from-green-800 via-gray-800 to-gray-900 flex items-center justify-center relative">
                                                <div className="text-center">
                                                    {idx === 0 && (
                                                        <div className="text-xs text-gray-400 font-mono absolute top-2 left-2">
                                                            <div>2024-07-13</div>
                                                            <div>03:54:05</div>
                                                        </div>
                                                    )}
                                                    {idx === 1 && (
                                                        <div className="text-xs text-gray-400 font-mono absolute top-2 left-2">
                                                            <div>2024-07-13</div>
                                                            <div>03:51:22</div>
                                                        </div>
                                                    )}
                                                    {idx === 2 && <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></div>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Accent elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-t border-gray-700 bg-[#2d2d2d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Video size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Real-time Detection</h3>
                            <p className="text-gray-400">AI-powered object detection processed locally on your hardware</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Privacy First</h3>
                            <p className="text-gray-400">All camera feeds stay on your hardware, never leaving your home</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Code size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Open Source</h3>
                            <p className="text-gray-400">Community-driven development with full transparency</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
