import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 , Building2 , HandHeart } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
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
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='log flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='login w-1/1 lg:w-1/3 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5 text-[#F83002]'>Login</h1>
                    <div className='my-2'>
                        <Label className='my-2'>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="email@gmail.com"
                        />
                    </div>

                    <div className='my-2'>
                        <Label className='my-2'>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Password"
                        />
                    </div>


                
                    <div className='my-4'>
                        <Label className=''>Login as:</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            
                            {/* FoodBank/NGO */}
                            <div 
                                onClick={() => setInput({ ...input, role: 'ngo' })}
                                className={`cursor-pointer border p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 
                                ${input.role === 'ngo' 
                                    ? 'border-[#F83002] bg-orange-50 ring-2 ring-orange-200' 
                                    : 'border-gray-200 hover:border-orange-300 bg-white'
                                }`}
                            >
                                <Building2 className={`w-8 h-8 ${input.role === 'ngo' ? 'text-[#F83002]' : 'text-gray-500'}`} />
                                <span className={`text-sm font-semibold ${input.role === 'ngo' ? 'text-[#F83002]' : 'text-gray-600'}`}>
                                    FoodBank / NGO
                                </span>
                            </div>

                            {/* Donor */}
                            <div 
                                onClick={() => setInput({ ...input, role: 'donor' })}
                                className={`cursor-pointer border p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 
                                ${input.role === 'donor' 
                                    ? 'border-[#F83002] bg-orange-50 ring-2 ring-orange-200' 
                                    : 'border-gray-200 hover:border-orange-300 bg-white'
                                }`}
                            >
                                <HandHeart className={`w-8 h-8 ${input.role === 'donor' ? 'text-[#F83002]' : 'text-gray-500'}`} />
                                <span className={`text-sm font-semibold ${input.role === 'donor' ? 'text-[#F83002]' : 'text-gray-600'}`}>
                                    Donor
                                </span>
                            </div>

                        </div>
                    </div>
                


                    {
                        loading ? <Button className="w-full my-4 bg-[#F83002]"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-[#F83002]">Login</Button>
                    }
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login