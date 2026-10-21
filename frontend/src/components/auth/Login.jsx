import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Building2, HandHeart, LockKeyhole, Mail } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,

                timeout: 20000,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                toast.error("Server is waking up from sleep mode. Please try again in 1 minute.");
            } else if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Network error. Please check your connection.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            {/* ✅ FIX: Reduced gap using py-4 and a tiny mt-2 */}
            <div className="flex-1 flex items-center justify-center relative px-4 sm:px-6 py-4 mt-2">
                
                {/* Decorative blobs */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <form 
                    onSubmit={submitHandler} 
                    className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 z-10"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-[#F83002] mb-4 shadow-inner">
                            <LockKeyhole className="w-8 h-8" />
                        </div>
                        <h1 className='font-extrabold text-3xl text-gray-900 tracking-tight'>Welcome Back</h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Log in to continue your journey with AnnSeva</p>
                    </div>

                    <div className="space-y-5">
                        
                        <div className="space-y-2">
                            <Label className="text-gray-700 font-semibold text-sm">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="name@example.com"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-700 font-semibold text-sm">Password</Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="••••••••"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Label className="text-gray-700 font-semibold text-sm mb-3 block">Login as:</Label>
                            <div className="grid grid-cols-2 gap-4">
                                
                                <div
                                    onClick={() => setInput({ ...input, role: 'ngo' })}
                                    className={`cursor-pointer border-2 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1
                                    ${input.role === 'ngo'
                                            ? 'border-[#F83002] bg-orange-50 shadow-md'
                                            : 'border-gray-100 hover:border-orange-200 bg-white hover:bg-orange-50/30 hover:shadow-sm'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${input.role === 'ngo' ? 'bg-[#F83002] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <span className={`text-sm font-bold tracking-wide ${input.role === 'ngo' ? 'text-[#F83002]' : 'text-gray-500'}`}>
                                        NGO / Bank
                                    </span>
                                </div>

                                <div
                                    onClick={() => setInput({ ...input, role: 'donor' })}
                                    className={`cursor-pointer border-2 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1
                                    ${input.role === 'donor'
                                            ? 'border-[#F83002] bg-orange-50 shadow-md'
                                            : 'border-gray-100 hover:border-orange-200 bg-white hover:bg-orange-50/30 hover:shadow-sm'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${input.role === 'donor' ? 'bg-[#F83002] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                        <HandHeart className="w-6 h-6" />
                                    </div>
                                    <span className={`text-sm font-bold tracking-wide ${input.role === 'donor' ? 'text-[#F83002]' : 'text-gray-500'}`}>
                                        Donor
                                    </span>
                                </div>

                            </div>
                        </div>

                        <div className="pt-4">
                            {loading ? (
                                <Button disabled className="w-full h-12 rounded-xl text-base font-bold bg-[#F83002]/80 cursor-not-allowed">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Authenticating...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-[#F83002] hover:bg-[#d82800] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                    Log In
                                </Button>
                            )}
                        </div>

                        <div className="text-center pt-2">
                            <span className="text-sm text-gray-500 font-medium">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-[#F83002] font-bold hover:underline transition-all">
                                    Sign up here
                                </Link>
                            </span>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login