import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Home, Store, Building2, Calendar, ShoppingBag } from 'lucide-react';
import { APPLICATION_API_END_POINT, DONATION_API_END_POINT } from '@/utils/constant';
import { setSingleDonation } from '@/redux/donationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import ApplyDonationDialog from './ApplyDonationDialog';

const DonationDescription = () => {
    const { singleDonation } = useSelector((store) => store.donation);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const { id: donationId } = useParams();
    const [remainingTime, setRemainingTime] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isExpired = singleDonation
        ? new Date(singleDonation.expiryAt).getTime() <= Date.now() ||
        (singleDonation.quantity - (singleDonation.applications?.length || 0)) <= 0
        : false;

    const isApplied = singleDonation?.applications?.some(app => {
        const applicantId = app.applicant?._id || app.applicant;
        return applicantId?.toString() === user?._id?.toString();
    }) || false;

    const applyDonationHandler = async () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }

        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${donationId}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setSingleDonation(res.data.donation));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const fetchSingleDonation = async () => {
            try {
                const res = await axios.get(
                    `${DONATION_API_END_POINT}/get/${donationId}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setSingleDonation(res.data.donation));
                }
            } catch (error) {
                console.error(error);
            }
        };
        if (donationId) fetchSingleDonation();
    }, [donationId, dispatch]);

    useEffect(() => {
        if (!singleDonation?.expiryAt) return;

        const interval = setInterval(() => {
            const diff = new Date(singleDonation.expiryAt).getTime() - Date.now();

            if (diff <= 0) {
                setRemainingTime("Expired");
                clearInterval(interval);
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setRemainingTime(`${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [singleDonation]);

    const donorTypeUI = {
        RESTAURANT: {
            label: "Restaurant",
            color: "bg-orange-100 text-orange-700",
            icon: <Store className="w-3 h-3" />
        },
        HOTEL: {
            label: "Hotel",
            color: "bg-blue-100 text-blue-700",
            icon: <Building2 className="w-3 h-3" />
        },
        SHOP: {
            label: "Shop",
            color: "bg-yellow-100 text-yellow-800",
            icon: <ShoppingBag className="w-3 h-3" />
        },
        EVENT: {
            label: "Event",
            color: "bg-purple-100 text-purple-700",
            icon: <Calendar className="w-3 h-3" />
        },
        INDIVIDUAL: {
            label: "Home",
            color: "bg-green-100 text-green-700",
            icon: <Home className="w-3 h-3" />
        },
    };



    return (
        <div className="max-w-6xl mx-auto px-4 my-10">
            {/* Hero card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#fb3003]">
                            {singleDonation?.title}
                        </h1>
                        <p className="text-sm text-grey-500">
                            by <span className='text-orange-500 font-medium'>{singleDonation?.donor?.userId?.fullname}</span>
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="ghost" className="text-blue-700 font-semibold">
                                {singleDonation?.quantity} Units
                            </Badge>
                            <Badge variant="ghost" className="text-[#F83002] font-semibold">
                                {singleDonation?.donationType}
                            </Badge>
                            <Badge variant="ghost" className="text-[#7209b7] font-semibold">
                                {singleDonation?.pickupLocation}
                            </Badge>
                        </div>
                    </div>


                    <Button
                        onClick={!isApplied && !isExpired ? () => setIsModalOpen(true) : undefined}
                        disabled={isApplied || isExpired}
                        className={`px-6 py-5 text-base rounded-xl ${isApplied || isExpired
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-[#F83002] hover:bg-[#e02c04]'
                            }`}
                    >
                        {isApplied ? 'Already Requested' : isExpired ? 'Expired' : 'Request Donation'}
                    </Button>
                </div>
            </div>

            {isModalOpen && (
                <ApplyDonationDialog
                    donation={singleDonation}
                    onClose={() => setIsModalOpen(false)}
                    onApplied={(updatedDonation) => {
                        dispatch(setSingleDonation(updatedDonation));
                    }}
                />
            )}

            {/* Status bar */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow border flex items-center justify-between">
                    <span className="font-semibold">Status</span>
                    <Badge className={`${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isExpired ? 'Expired' : 'Active'}
                    </Badge>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border flex items-center justify-between">
                    <span className="font-semibold">Donation From</span>

                    {singleDonation?.donor?.donorType &&
                        donorTypeUI[singleDonation.donor.donorType] ? (
                        <Badge
                            className={`flex items-center gap-1
          ${donorTypeUI[singleDonation.donor.donorType].color}`}
                        >
                            {donorTypeUI[singleDonation.donor.donorType].icon}
                            {donorTypeUI[singleDonation.donor.donorType].label}
                        </Badge>
                    ) : (
                        <Badge className="bg-gray-400 text-white">N/A</Badge>
                    )}
                </div>

                <div className="bg-white p-4 rounded-xl shadow border flex items-center justify-between">
                    <span className="font-semibold">Time Left</span>
                    <Badge className="bg-orange-100 text-orange-700">
                        {remainingTime || "Calculating..."}
                    </Badge>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border flex items-center justify-between">
                    <span className="font-semibold">Total Requests</span>
                    <Badge className="bg-blue-100 text-blue-600">
                        {singleDonation?.applications?.length || 0}
                    </Badge>
                </div>



            </div>



            {/* Details */}
            <div className="mt-8 bg-white rounded-2xl shadow p-6 md:p-8 border">
                <h2 className="text-xl font-bold border-b pb-3 mb-6">
                    Donation Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                    <p><strong>Description:</strong> {singleDonation?.description}</p>
                    <p><strong>Pickup Location:</strong> {singleDonation?.pickupLocation}</p>
                    <p><strong>Freshness Level:</strong> {singleDonation?.freshnessLevel}</p>
                    <p><strong>Posted On:</strong> {singleDonation?.createdAt?.split("T")[0]}</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-bold mb-2">Items</h3>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(singleDonation?.items) && singleDonation.items.length > 0
                            ? singleDonation.items.map((item, i) => (
                                <Badge key={i} className="bg-[#fb3003] text-white">
                                    {item}
                                </Badge>
                            ))
                            : <span>N/A</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationDescription;
