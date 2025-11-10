import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, DONATION_API_END_POINT } from '@/utils/constant';
import { useSelector, useDispatch } from 'react-redux';
import { setSingleDonation } from '@/redux/donationSlice';
import { toast } from 'sonner';

const Donation = ({ donation }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [freshDonation, setFreshDonation] = useState(donation);

    // Fetch fresh donation to check if current user already applied
        useEffect(() => {
        const fetchDonation = async () => {
            try {
                const res = await axios.get(
                    `${DONATION_API_END_POINT}/get/${donation._id}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    const donationData = res.data.donation;
                    setFreshDonation(donationData);
                    dispatch(setSingleDonation(donationData));

                    // Check only if user exists
                    if (user?._id) {
                        const applied = donationData?.applications?.some(
                            app => app.applicant?._id?.toString() === user._id
                        );
                        setIsApplied(applied);
                    } else {
                        setIsApplied(false);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDonation();
    }, [donation._id, dispatch, user?._id]);


    // useEffect(() => {
    //     if (user?._id && donation?.applications) {
    //         const applied = donation.applications.some(
    //             app => app.applicant?._id?.toString() === user._id
    //         );
    //         setIsApplied(applied);
    //     } else {
    //         setIsApplied(false);
    //     }
    // }, [donation.applications, user?._id]);

    // Apply donation handler
    const applyDonationHandler = async () => {

        try {
            setLoading(true);
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${donation._id}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsApplied(true);
                toast.success(res.data.message);

                // Update local donation data
                const updatedDonation = {
                    ...freshDonation,
                    applications: [...(freshDonation?.applications || []), { applicant: { _id: user._id } }]
                };
                setFreshDonation(updatedDonation);
                dispatch(setSingleDonation(updatedDonation));
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            
            <div className='don flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {new Date(freshDonation?.createdAt).toDateString()}
                </p>
                <Button variant="outline" className="rounded-full" size="icon">
                    <Bookmark />
                </Button>
            </div>

            {/* Donor ke Infos */}
            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={donation?.donor?.logo} alt="Donor Logo" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{freshDonation?.donor?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            {/* Donation ke Details */}
            <div>
                <h1 className='font-bold text-lg my-2'>{freshDonation?.title}</h1>
                <p className='text-sm text-gray-600'>{freshDonation?.description}</p>
            </div>

           
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold' variant="ghost">{freshDonation?.quantity} Units</Badge>
                <Badge className='text-[#F83002] font-bold' variant="ghost">{freshDonation?.donationType}</Badge>
                <Badge className='text-[#7209b7] font-bold' variant="ghost">{freshDonation?.pickupLocation}</Badge>
            </div>

           
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${freshDonation?._id}`)} variant="outline">
                    Details
                </Button>

                <Button
                    onClick={!isApplied ? applyDonationHandler : undefined}
                    disabled={isApplied || loading}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#F83002] hover:bg-[#d82800]'}`}
                >
                    {loading ? "Processing..." : isApplied ? "Already Requested" : "Request Donation"}
                </Button>
            </div>
        </div>
    );
};

export default Donation;

