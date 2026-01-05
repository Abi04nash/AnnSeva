import React, { useMemo, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark, Home, Store, Building2, Calendar, ShoppingBag, MapPin, Utensils, Package} from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { USER_API_END_POINT } from '@/utils/constant';
import { useSelector, useDispatch } from 'react-redux';
import { updateDonationInList } from '@/redux/donationSlice';
import { updateUserSavedDonations } from '@/redux/authSlice';
import { toast } from 'sonner';
import ApplyDonationDialog from './ApplyDonationDialog';


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

const Donation = ({ donation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);




  const donationFromStore = useSelector(state =>
    state.donation.allDonations.find(d => d._id === donation._id)
  );

  const donationData = donationFromStore || donation;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


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


  const saved = user?.savedDonations?.some(
    id => id.toString() === donation._id
  );


  const toggleSaveHandler = async () => {
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-donation/${donationData._id}`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message);

      dispatch(updateUserSavedDonations(donationData._id));
    } catch (err) {
      toast.error("Something went wrong");
    }
  };






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
    <div className='p-5 my-2 rounded-md shadow-xl hover:shadow-2xl transition-all dur-ation300 overflow-hidden bg-white border border-gray-100'>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-medium text-gray-500'>
          <div className='flex flex-col'>
         <span className='text-[10px] uppercase tracking-wider font-semibold text-gray-400'>Posted on</span>
          {new Date(donationData?.createdAt).toDateString()}
          </div>
        </p>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSaveHandler}
          className={`rounded-full transition ${saved ? 'bg-orange-100' : ''}`}
        >
          <Bookmark
            className={`transition ${saved ? 'fill-[#F83002] text-[#F83002]' : ''
              }`}
          />
        </Button>


      </div>

      <div className='flex items-center gap-2 my-3'>
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

          <p className="text-sm text-grey-500">
            by <span className='text-orange-500 font-medium'>{donationData?.donor?.userId?.fullname}</span>
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 mb-4"></div>

      <div>
        <h1 className='font-bold text-lg my-2'>{donationData?.title}</h1>
        <p className='text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-10'>
          {donationData?.description}
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-2 my-4'>
        <Badge className='text-blue-700 bg-blue-50 text-xs font-medium border border-blue-100' variant='ghost'>
          <Package className="w-3 h-3" />
          {donationData?.quantity} Units
        </Badge>
        <Badge className='text-[#F83002] bg-rose-50 text-xs font-medium border border-rose-100' variant='ghost'>
        <Utensils className='w-3 h-3'/>
          {donationData?.donationType}
        </Badge>
        <Badge className='text-[#7209b7] bg-violet-50 text-xs font-medium border border-violet-100' variant='ghost'>
          <MapPin className="w-3 h-3" />
          {donationData?.pickupLocation}
        </Badge>
      </div>

      <div className='flex items-center gap-3 mt-auto'>
        <Button className="flex-1 border-gray-300 hover:bg-gray-50 font-medium" onClick={() => navigate(`/description/${donationData?._id}`)} variant='outline'>
          Details
        </Button>

        <Button
          onClick={() => setIsModalOpen(true)} 
          disabled={isApplied || isExpired || loading}
          className={`flex-1 font-medium shadow-md transition-all ${isApplied || isExpired
            ? 'bg-gray-500 cursor-not-allowed'
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


      {isModalOpen && (
        <ApplyDonationDialog
          donation={donationData}
          onClose={() => setIsModalOpen(false)}
          onApplied={(updatedDonation) => {
            dispatch(updateDonationInList(updatedDonation));
          }}
        />
      )}

    </div>
  );
};

export default Donation;