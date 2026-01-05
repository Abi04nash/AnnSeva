import React from 'react';
import { useEffect } from 'react';
import { Badge } from './ui/badge';
// import Donation from './Donation'
import { MapPin, Utensils, Package } from 'lucide-react';

import { setSearchedQuery } from '@/redux/donationSlice'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import useGetAllDonations from '@/hooks/useGetAllDonations';

const LatestDonationCard = ({ donation }) => {
    const navigate = useNavigate();
    useGetAllDonations()
    const { allDonations } = useSelector(store => store.donation)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""))
        }
    }, [dispatch])

    return (
        <div
            onClick={() => navigate(`/description/${donation._id}`)}
            className="doca p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
        >
            <div>
                <h1 className="font-medium text-sm">{donation?.donor?.name}</h1>
                <p className="text-xs text-gray-500">India</p>
            </div>
            <div>
                <h1 className="font-bold text-xl my-2 text-[#F83002] ">{donation?.title}</h1>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{donation?.description}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 my-4'>
                <Badge className='text-blue-700 bg-blue-50 text-xs font-medium border border-blue-100' variant='ghost'>
                    <Package className="w-3 h-3" />
                    {donation?.quantity} Units
                </Badge>
                <Badge className='text-[#F83002] bg-rose-50 text-xs font-medium border border-rose-100' variant='ghost'>
                    <Utensils className='w-3 h-3' />
                    {donation?.donationType}
                </Badge>
                <Badge className='text-[#7209b7] bg-violet-50 text-xs font-medium border border-violet-100' variant='ghost'>
                    <MapPin className="w-3 h-3" />
                    {donation?.pickupLocation}
                </Badge>
            </div>
        </div>
    );
};





export default LatestDonationCard;