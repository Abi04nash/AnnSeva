import React, { useMemo, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark, Home, Store, Building2, Calendar, ShoppingBag } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useSelector, useDispatch } from 'react-redux';
import { updateDonationInList } from '@/redux/donationSlice';
import { toast } from 'sonner';

/* ADDED = donorType UI config (NO LOGIC CHANGE) */
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
  BY_HOUSE: {
    label: "Home",
    color: "bg-green-100 text-green-700",
    icon: <Home className="w-3 h-3" />
  },
};

const Donation = ({ donation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  const donationFromStore = useSelector(state =>
    state.donation.allDonations.find(d => d._id === donation._id)
  );

  const donationData = donationFromStore || donation;
  const [loading, setLoading] = useState(false);

  const isApplied = useMemo(() => {
    if (!user || !donationData?.applications) return false;
    return donationData.applications.some(app => {
      const applicantId = app.applicant?._id || app.applicant;
      return applicantId?.toString() === user._id?.toString();
    });
  }, [donationData, user]);

  const isExpired = useMemo(() => {
    if (!donationData) return false;
    const timeExpired = new Date(donationData.expiryAt).getTime() <= Date.now();
    const qtyOver = (donationData.quantity - (donationData.applications?.length || 0)) <= 0;
    return timeExpired || qtyOver;
  }, [donationData]);

  const applyDonationHandler = async () => {
    if (!user?._id) {
      toast.error('Please login first');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${donationData._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(updateDonationInList(res.data.donation));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {new Date(donationData?.createdAt).toDateString()}
        </p>
        <Button variant='outline' className='rounded-full' size='icon'>
          <Bookmark />
        </Button>
      </div>

      <div className='flex items-center gap-2 my-2'>
        <Button className='p-6' variant='outline' size='icon'>
          <Avatar>
            <AvatarImage src={donationData?.donor?.logo} />
          </Avatar>
        </Button>

        <div>
          {/* UI Addition (donorType badge) */}
          <div className="flex items-center gap-2">
            <h1 className='font-medium text-lg'>
              {donationData?.donor?.name}
            </h1>

            {donationData?.donor?.donorType &&
              donorTypeUI[donationData.donor.donorType] && (
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold
                  ${donorTypeUI[donationData.donor.donorType].color}`}
                >
                  {donorTypeUI[donationData.donor.donorType].icon}
                  {donorTypeUI[donationData.donor.donorType].label}
                </span>
              )}
          </div>

          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>

      <div>
        <h1 className='font-bold text-lg my-2'>{donationData?.title}</h1>
        <p className='text-sm text-gray-600'>{donationData?.description}</p>
      </div>

      <div className='flex flex-wrap items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant='ghost'>
          {donationData?.quantity} Units
        </Badge>
        <Badge className='text-[#F83002] font-bold' variant='ghost'>
          {donationData?.donationType}
        </Badge>
        <Badge className='text-[#7209b7] font-bold' variant='ghost'>
          {donationData?.pickupLocation}
        </Badge>
      </div>

      <div className='flex items-center gap-4 mt-4'>
        <Button onClick={() => navigate(`/description/${donationData?._id}`)} variant='outline'>
          Details
        </Button>

        <Button
          onClick={!isApplied && !isExpired ? applyDonationHandler : undefined}
          disabled={isApplied || isExpired || loading}
          className={`rounded-lg ${isApplied || isExpired
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-[#F83002] hover:bg-[#d82800]'}`}
        >
          {loading
            ? 'Processing...'
            : isApplied
              ? 'Already Requested'
              : isExpired
                ? 'Expired'
                : 'Request Donation'}
        </Button>
      </div>
    </div>
  );
};

export default Donation;
