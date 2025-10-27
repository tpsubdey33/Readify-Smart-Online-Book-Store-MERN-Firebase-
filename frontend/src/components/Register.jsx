import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaStore, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error"); // 'error' or 'success'
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('user');
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser, signInWithGoogle, error, clearError } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // Clear errors when component mounts or when user type changes
    React.useEffect(() => {
        clearError();
        setMessage("");
    }, [userType, clearError]);

    // Sync with auth context errors
    React.useEffect(() => {
        if (error) {
            setMessage(error);
            setMessageType('error');
        }
    }, [error]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessage("");
        setMessageType('error');
        clearError();
        
        try {
            const userData = {
                username: data.username,
                email: data.email,
                password: data.password,
                role: userType,
                profile: {
                    fullName: data.fullName,
                    phone: data.phone
                }
            };

            // Add bookseller specific fields
            if (userType === 'bookseller') {
                userData.profile.storeName = data.storeName;
                userData.profile.storeDescription = data.storeDescription;
                userData.profile.businessLicense = data.businessLicense;
                userData.profile.storeContact = {
                    phone: data.storePhone,
                    email: data.storeEmail || data.email // Use main email if store email not provided
                };
            }

            const { backendUser } = await registerUser(userData);
            
            // Success message with role-specific navigation
            setMessage(`Successfully registered as ${userType === 'user' ? 'Reader' : 'Bookseller'}! Redirecting...`);
            setMessageType('success');
            
            // Redirect after a short delay to show success message
            setTimeout(() => {
                if (userType === 'bookseller') {
                    navigate("/bookseller/dashboard");
                } else {
                    navigate("/books");
                }
            }, 1500);
            
        } catch (error) {
            // Error message is already set by the auth context
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setMessage("");
        clearError();
        
        try {
            const { backendUser } = await signInWithGoogle();
            setMessage("Google sign in successful! Redirecting...");
            setMessageType('success');
            
            setTimeout(() => {
                // For Google sign-in, check the actual role from backend user
                if (backendUser.role === 'bookseller') {
                    navigate("/bookseller/dashboard");
                } else {
                    navigate("/books");
                }
            }, 1500);
        } catch (error) {
            setMessage("Google sign in failed. Please try again.");
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-indigo-600 mb-2">BookStore</h1>
                    </Link>
                    <p className="text-gray-600">Join our community of book lovers and sellers</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Side - Illustration & Info */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 hidden md:block">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {userType === 'user' ? (
                                    <FaUser className="text-3xl text-indigo-600" />
                                ) : (
                                    <FaStore className="text-3xl text-indigo-600" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {userType === 'user' ? 'Join as Reader' : 'Join as Bookseller'}
                            </h2>
                            <p className="text-gray-600">
                                {userType === 'user' 
                                    ? 'Discover your next favorite book and connect with fellow readers.'
                                    : 'Sell your books to thousands of readers and grow your business.'
                                }
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-600 text-sm font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        {userType === 'user' ? 'Personalized Recommendations' : 'Seller Dashboard'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {userType === 'user' 
                                            ? 'Get book recommendations based on your interests'
                                            : 'Manage your inventory and track sales performance'
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-600 text-sm font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        {userType === 'user' ? 'Wishlist & Reviews' : 'Analytics & Reports'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {userType === 'user' 
                                            ? 'Save books and share your thoughts with the community'
                                            : 'Get detailed insights about your sales and customer behavior'
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-green-600 text-sm font-bold">✓</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        {userType === 'user' ? 'Community Access' : 'Secure Payments'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {userType === 'user' 
                                            ? 'Join book clubs and discussion groups'
                                            : 'Receive payments securely with multiple payment options'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Destination Info */}
                            <div className="flex items-start space-x-3 pt-4 border-t border-gray-200">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 text-sm font-bold">→</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        After Registration
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {userType === 'user' 
                                            ? 'You will be redirected to browse our book collection'
                                            : 'You will be redirected to your seller dashboard panel'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* User Type Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I want to join as:
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setUserType('user')}
                                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                                        userType === 'user'
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                >
                                    <FaUser className="text-xl mx-auto mb-2" />
                                    <div className="font-semibold">Reader</div>
                                    <div className="text-sm opacity-75">Book Lover</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('bookseller')}
                                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                                        userType === 'bookseller'
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                                >
                                    <FaStore className="text-xl mx-auto mb-2" />
                                    <div className="font-semibold">Bookseller</div>
                                    <div className="text-sm opacity-75">Sell Books</div>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        {...register("fullName", { required: "Full name is required" })}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        {...register("phone", {
                                            pattern: {
                                                value: /^[+]?[1-9][\d\s\-()]{8,}$/,
                                                message: "Please enter a valid phone number"
                                            }
                                        })}
                                        type="tel"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Bookseller Specific Fields */}
                            {userType === 'bookseller' && (
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                                        <FaStore className="mr-2" />
                                        Store Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Name *
                                            </label>
                                            <input
                                                {...register("storeName", { 
                                                    required: "Store name is required for booksellers" 
                                                })}
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                placeholder="Your Bookstore Name"
                                            />
                                            {errors.storeName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Description
                                            </label>
                                            <textarea
                                                {...register("storeDescription", {
                                                    maxLength: {
                                                        value: 500,
                                                        message: "Description should not exceed 500 characters"
                                                    }
                                                })}
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                placeholder="Tell us about your bookstore..."
                                            />
                                            {errors.storeDescription && (
                                                <p className="text-red-500 text-sm mt-1">{errors.storeDescription.message}</p>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Business License
                                                </label>
                                                <input
                                                    {...register("businessLicense")}
                                                    type="text"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    placeholder="License number (if applicable)"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Phone
                                                </label>
                                                <input
                                                    {...register("storePhone", {
                                                        pattern: {
                                                            value: /^[+]?[1-9][\d\s\-()]{8,}$/,
                                                            message: "Please enter a valid phone number"
                                                        }
                                                    })}
                                                    type="tel"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    placeholder="Store contact number"
                                                />
                                                {errors.storePhone && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.storePhone.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Store Email
                                            </label>
                                            <input
                                                {...register("storeEmail", {
                                                    pattern: {
                                                        value: /^\S+@\S+$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                type="email"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                placeholder="store@email.com"
                                            />
                                            {errors.storeEmail && (
                                                <p className="text-red-500 text-sm mt-1">{errors.storeEmail.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Account Information */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="font-semibold text-gray-800 mb-4">Account Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username *
                                        </label>
                                        <input
                                            {...register("username", { 
                                                required: "Username is required",
                                                minLength: {
                                                    value: 3,
                                                    message: "Username must be at least 3 characters"
                                                },
                                                pattern: {
                                                    value: /^[a-zA-Z0-9_]+$/,
                                                    message: "Username can only contain letters, numbers, and underscores"
                                                }
                                            })}
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            placeholder="Choose a username"
                                        />
                                        {errors.username && (
                                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            {...register("email", { 
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register("password", { 
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Password must be at least 6 characters"
                                                    }
                                                })}
                                                type={showPassword ? "text" : "password"}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-12"
                                                placeholder="Create a strong password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-4 rounded-lg border ${
                                    messageType === 'success' 
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                    <p className="text-sm">{message}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    `Create ${userType === 'user' ? 'Reader' : 'Bookseller'} Account`
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaGoogle className="text-red-500" />
                                Sign up with Google
                            </button>
                        </div>

                        <p className="text-center text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register