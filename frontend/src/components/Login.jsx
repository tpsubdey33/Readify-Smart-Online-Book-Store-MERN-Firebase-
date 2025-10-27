import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaGoogle, FaEye, FaEyeSlash, FaUser, FaLock, FaBook, FaUserShield } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Login = () => {
    const [message, setMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginType, setLoginType] = useState('user') // 'user', 'admin', 'bookseller'
    const { loginUser, signInWithGoogle, currentUser } = useAuth();
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || "/"

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            const redirectPath = getRedirectPath(currentUser.role)
            navigate(redirectPath, { replace: true })
        }
    }, [currentUser, navigate])

    const getRedirectPath = (role) => {
    switch (role) {
        case 'admin':
            return '/dashboard'
        case 'bookseller':
            return '/bookseller' // Changed from '/bookSeller-dashboard'
        case 'user':
            return '/books'
        default:
            return from
    }
}

    const onSubmit = async (data) => {
        setIsLoading(true)
        setMessage("")
        
        try {
            let credentials = {}
            
            if (loginType === 'admin') {
                credentials = { username: data.username, password: data.password }
            } else {
                credentials = { email: data.email, password: data.password }
            }

            const user = await loginUser(credentials, loginType);
            console.log('Login successful, user:', user); // Debug log
            Swal.fire({
                title: "Login Successful!",
                text: `Welcome back, ${user.username || user.email}!`,
                icon: "success",
                confirmButtonColor: "#10B981",
                timer: 2000,
                showConfirmButton: false
            })

            // Redirect based on user role
            const redirectPath = getRedirectPath(user.role)
            console.log('Redirecting to:', redirectPath); // Debug log
            navigate(redirectPath, { replace: true })
            
        } catch (error) {
            console.error("Login error:", error)
            setMessage(error.response?.data?.message || "Login failed. Please check your credentials.")
            
            Swal.fire({
                title: "Login Failed",
                text: error.response?.data?.message || "Invalid credentials",
                icon: "error",
                confirmButtonColor: "#EF4444",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            await signInWithGoogle();
            Swal.fire({
                title: "Login Successful!",
                text: "Welcome to Readify!",
                icon: "success",
                confirmButtonColor: "#10B981",
                timer: 2000,
                showConfirmButton: false
            })
            navigate(from, { replace: true })
        } catch (error) {
            console.error("Google sign in error:", error)
            Swal.fire({
                title: "Google Sign In Failed",
                text: "Unable to sign in with Google. Please try again.",
                icon: "error",
                confirmButtonColor: "#EF4444",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleLoginTypeChange = (type) => {
        setLoginType(type)
        setMessage("")
        reset()
    }

    const getLoginTypeIcon = () => {
        switch (loginType) {
            case 'admin':
                return <FaUserShield className="text-blue-600" />
            case 'bookseller':
                return <FaBook className="text-green-600" />
            default:
                return <FaUser className="text-purple-600" />
        }
    }

    const getLoginTypeTitle = () => {
        switch (loginType) {
            case 'admin':
                return "Admin Login"
            case 'bookseller':
                return "Bookseller Login"
            default:
                return "User Login"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="bg-white p-2 rounded-full">
                            {getLoginTypeIcon()}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{getLoginTypeTitle()}</h2>
                    </div>
                    <p className="text-blue-100">
                        {loginType === 'admin' 
                            ? "Access the admin dashboard" 
                            : loginType === 'bookseller'
                            ? "Manage your books and orders"
                            : "Welcome back to your account"
                        }
                    </p>
                </div>

                {/* Login Type Selector */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => handleLoginTypeChange('user')}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                            loginType === 'user'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaUser className="inline-block mr-2" />
                        User
                    </button>
                    <button
                        onClick={() => handleLoginTypeChange('bookseller')}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                            loginType === 'bookseller'
                                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaBook className="inline-block mr-2" />
                        Bookseller
                    </button>
                    <button
                        onClick={() => handleLoginTypeChange('admin')}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                            loginType === 'admin'
                                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FaUserShield className="inline-block mr-2" />
                        Admin
                    </button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username for Admin, Email for others */}
                        {loginType === 'admin' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        {...register("username", { 
                                            required: "Username is required",
                                            minLength: {
                                                value: 3,
                                                message: "Username must be at least 3 characters"
                                            }
                                        })} 
                                        type="text" 
                                        placeholder="Enter your username"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        {...register("email", { 
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })} 
                                        type="email" 
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        )}

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    {...register("password", { 
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })} 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {message && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">{message}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing In...
                                </div>
                            ) : (
                                `Sign In as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}`
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button 
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaGoogle className="text-red-500" />
                        Sign in with Google
                    </button>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link 
                                to="/register" 
                                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-500 text-xs">
                            © {new Date().getFullYear()} Readify Bookstore. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login