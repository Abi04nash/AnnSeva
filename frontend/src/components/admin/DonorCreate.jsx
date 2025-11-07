import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DONOR_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleDonor } from '@/redux/donorSlice';

const DonorCreate = () => {
    const navigate = useNavigate();
    const [donorName, setDonorName] = useState('');
    const dispatch = useDispatch();

    const registerNewDonor = async () => {
        try {
            const res = await axios.post(
                `${DONOR_API_END_POINT}/register`,
                { donorName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (res?.data?.success) {
                dispatch(setSingleDonor(res.data.donor));
                toast.success(res.data.message);
                const donorID = res?.data?.donor?._id;
                navigate(`/admin/donors/${donorID}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='p-2 max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>
                        Your <span className='text-orange-600'>Source</span> Name
                    </h1>
                </div>

                <Label>Source Name</Label>
                <Input
                    type='text'
                    className='my-2'
                    placeholder='Bawarchi, Haldiram, etc.'
                    onChange={(e) => setDonorName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant='outline' onClick={() => navigate('/admin/donors')}>
                        Cancel
                    </Button>
                    <Button className='bg-[#F83002]' onClick={registerNewDonor}>
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DonorCreate;
