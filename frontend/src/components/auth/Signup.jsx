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
import { setLoading } from '@/redux/authSlice'
import { Loader2, Building2, HandHeart, User, Mail, Phone, LockKeyhole, ImagePlus } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.role) {
            toast.error("Please select if you are a FoodBank or a Donor");
            return; 
        }

        const formData = new FormData();    
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(`${res.data.message}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
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
            
            {/* Same perfect small gap as Login */}
            <div className="flex-1 flex items-center justify-center relative px-4 sm:px-6 py-4 mt-2">
                
                {/* Decorative blobs */}
                <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <form 
                    onSubmit={submitHandler} 
                    className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 z-10"
                >
                    <div className="text-center mb-6">
                        <h1 className='font-extrabold text-3xl text-gray-900 tracking-tight'>
                            Join <span className="text-[#F83002]">AnnSeva</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Create an account to make a difference</p>
                    </div>

                    <div className="space-y-4">
                        
                        {/* Full Name Input */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-700 font-semibold text-sm">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="John Doe"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-700 font-semibold text-sm">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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

                        {/* Phone Number Input */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-700 font-semibold text-sm">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="9876543210"
                                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-700 font-semibold text-sm">Password</Label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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

                        {/* Role Selection */}
                        <div className="pt-1">
                            <Label className="text-gray-700 font-semibold text-sm mb-2 block">Register as:</Label>
                            <div className="grid grid-cols-2 gap-3">
                                
                                {/* FoodBank/NGO */}
                                <div
                                    onClick={() => setInput({ ...input, role: 'ngo' })}
                                    className={`cursor-pointer border-2 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5
                                    ${input.role === 'ngo'
                                            ? 'border-[#F83002] bg-orange-50 shadow-sm'
                                            : 'border-gray-100 hover:border-orange-200 bg-white hover:bg-orange-50/30'
                                        }`}
                                >
                                    <Building2 className={`w-5 h-5 ${input.role === 'ngo' ? 'text-[#F83002]' : 'text-gray-400'}`} />
                                    <span className={`text-xs font-bold tracking-wide ${input.role === 'ngo' ? 'text-[#F83002]' : 'text-gray-500'}`}>
                                        NGO / Bank
                                    </span>
                                </div>

                                {/* Donor */}
                                <div
                                    onClick={() => setInput({ ...input, role: 'donor' })}
                                    className={`cursor-pointer border-2 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5
                                    ${input.role === 'donor'
                                            ? 'border-[#F83002] bg-orange-50 shadow-sm'
                                            : 'border-gray-100 hover:border-orange-200 bg-white hover:bg-orange-50/30'
                                        }`}
                                >
                                    <HandHeart className={`w-5 h-5 ${input.role === 'donor' ? 'text-[#F83002]' : 'text-gray-400'}`} />
                                    <span className={`text-xs font-bold tracking-wide ${input.role === 'donor' ? 'text-[#F83002]' : 'text-gray-500'}`}>
                                        Donor
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Profile Image File Upload */}
                        <div className="space-y-1.5 pt-1">
                            <Label className="text-gray-700 font-semibold text-sm">Profile Picture</Label>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-gray-400">
                                    <ImagePlus className="w-5 h-5" />
                                </div>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#F83002] hover:file:bg-orange-100 text-sm text-gray-500 bg-transparent border-0 focus-visible:ring-0 p-0 h-auto w-full"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            {loading ? (
                                <Button disabled className="w-full h-12 rounded-xl text-base font-bold bg-[#F83002]/80 cursor-not-allowed">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-[#F83002] hover:bg-[#d82800] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                    Sign Up
                                </Button>
                            )}
                        </div>

                        {/* Login link */}
                        <div className="text-center pt-1">
                            <span className="text-sm text-gray-500 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#F83002] font-bold hover:underline transition-all">
                                    Log In here
                                </Link>
                            </span>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup