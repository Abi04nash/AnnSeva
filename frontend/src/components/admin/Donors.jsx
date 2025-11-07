import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import DonorsTable from './DonorsTable';
import { useNavigate } from 'react-router-dom';
import useGetAllDonors from '@/hooks/useGetAllDonors';
import { useDispatch } from 'react-redux';
import { setSearchDonorByText } from '@/redux/donorSlice';

const Donors = () => {
    useGetAllDonors(); // ✅ renamed
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchDonorByText(input)); // ✅ renamed action
    }, [input, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className=' tab p-1 lg:p-0 flex items-center justify-between my-5'>
                    <Input
                        className='w-fit'
                        placeholder='Filter by donor name'
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                        className='bg-[#F83002]'
                        onClick={() => navigate('/admin/donors/create')}
                    >
                        New Donor
                    </Button>
                </div>
                <DonorsTable /> {/* ✅ renamed */}
            </div>
        </div>
    );
};

export default Donors;
