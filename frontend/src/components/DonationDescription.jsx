import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, DONATION_API_END_POINT } from '@/utils/constant';
import { setSingleDonation } from '@/redux/donationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const DonationDescription = () => {
    const { singleDonation } = useSelector((store) => store.donation);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const params = useParams();
    const donationId = params.id;

    const [isApplied, setIsApplied] = useState(false);

    // ✅ Apply / Request Donation Handler
    const applyDonationHandler = async () => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${donationId}`,
                {}, // empty body
                { withCredentials: true } // ✅ correct config placement
            );

            if (res.data.success) {
                setIsApplied(true);
                const updatedDonation = {
                    ...singleDonation,
                    applications: [
                        ...(singleDonation?.applications || []),
                        { applicant: user?._id },
                    ],
                };
                dispatch(setSingleDonation(updatedDonation));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    // ✅ Fetch Single Donation
    useEffect(() => {
        const fetchSingleDonation = async () => {
            try {
                const res = await axios.get(
                    `${DONATION_API_END_POINT}/get/${donationId}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const donationData = res.data.donation;
                    dispatch(setSingleDonation(donationData));

                    // const applied = donationData?.applications?.some(
                    //     (application) => application.applicant === user?._id
                    // );

                       // ✅ FIXED: check if logged-in user already applied
                const applied = donationData?.applications?.some(
                    (application) =>
                        application.applicant?._id?.toString() === user?._id
                );
                    setIsApplied(applied);
                }
            } catch (error) {
                console.error("Error fetching donation:", error);
            }
        };
        if (donationId) fetchSingleDonation();
    }, [donationId, dispatch, user?._id]);

    return (
        <div className="dodes p-2 max-w-7xl mx-auto my-10">
            <div className="des ga flex items-center justify-between">
                <div className='des2'>
                    <h1 className="font-bold text-xl text-[#fb3003]">{singleDonation?.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge className="bad text-blue-700 font-bold" variant="ghost">
                            {singleDonation?.quantity} Units
                        </Badge>
                        <Badge className="bad text-[#F83002] font-bold" variant="ghost">
                            {singleDonation?.donationType}
                        </Badge>
                        <Badge className="bad text-[#7209b7] font-bold" variant="ghost">
                            {singleDonation?.pickupLocation}
                        </Badge>
                    </div>

                </div>

                <Button
                    onClick={!isApplied ? applyDonationHandler : undefined}
                    disabled={isApplied}
                    className={` btn rounded-lg ${isApplied
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-[#F83002] hover:bg-[rgb(248,48,2)]'
                        }`}
                >
                    {isApplied ? 'Already Requested' : 'Request Donation'}
                </Button>
            </div>

            <h1 className="border-b-2 border-b-gray-300 font-bold lg:text-lg py-4">Donation Details</h1>
            <div className="my-4">
                <h1 className='font-bold my-1'>
                    Title: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.title}</span>
                </h1>
                <h1 className='font-bold my-1'>
                    Description: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.description}</span>
                </h1>
                <h1 className='font-bold my-1'>
                    Pickup Location: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.pickupLocation}</span>
                </h1>
                <h1 className='font-bold my-1'>
                    Quantity: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.quantity}</span>
                </h1>
                <h1 className='font-bold my-1'>
                    Donation Type: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.donationType}</span>
                </h1>
                <h1 className='font-bold my-1'>
                    Freshness Level: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.freshnessLevel}</span>
                </h1>
               <div className='flex my-2'>
                    <h1 className='font-bold my-1'>Items:</h1>
                    <div className='pl-4 flex flex-wrap gap-2'>
                        {Array.isArray(singleDonation?.items) && singleDonation.items.length > 0 ? (
                            singleDonation.items.map((item, index) => (
                                <Badge key={index} className="bad bg-[#fb3003] text-white text-sm hover:bg-[#e02c04]">
                                    {item}
                                </Badge>
                            ))
                        ) : (
                            <span className='font-normal text-gray-800'>N/A</span>
                        )}
                    </div>
                </div>
                <h1 className='font-bold my-1'>
                    Total Requests: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.applications?.length || 0}</span>
                </h1>
                <h1 className='font-bold my-1'>
                    Posted On: <span className='pl-4 font-normal text-gray-800'>{singleDonation?.createdAt?.split("T")[0]}</span>
                </h1>

            </div>
        </div>
    );
};

export default DonationDescription;
