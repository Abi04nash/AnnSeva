import { setSingleDonor } from '@/redux/donorSlice';
import { setAllDonations } from '@/redux/donationSlice';
import { DONOR_API_END_POINT, DONATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// console.log("useGetDonorById hook loaded");



const useGetDonorById = (donorId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSingleDonor = async () => {
            try {
                const res = await axios.get(`${DONOR_API_END_POINT}/get/${donorId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleDonor(res.data.donor));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleDonor();
    }, [donorId, dispatch]);
};

export default useGetDonorById;




