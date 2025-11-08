import React from 'react';
import { useEffect } from 'react';
import { Badge } from './ui/badge';
// import Donation from './Donation'
import { setSearchedQuery } from '@/redux/donationSlice'
import { useNavigate} from 'react-router-dom';
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
                <h1 className="font-medium text-lg">{donation?.donor?.name}</h1>
                <p className="text-sm text-gray-500">India</p>
            </div>
            <div>
                <h1 className="font-bold text-lg my-2 text-[#F83002] ">{donation?.title}</h1>
                <p className="text-sm text-gray-600">{donation?.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <Badge className={'bad text-blue-700 font-bold'} variant="ghost">
                    {donation?.quantity} Available
                </Badge>
                <Badge className={'bad text-[#F83002] font-bold'} variant="ghost">
                    {donation?.donationType}
                </Badge>
                <Badge className={'bad text-[#7209b7] font-bold'} variant="ghost">
                    {donation?.pickupLocation}
                </Badge>
            </div>
        </div>
    );
};

export default LatestDonationCard;
