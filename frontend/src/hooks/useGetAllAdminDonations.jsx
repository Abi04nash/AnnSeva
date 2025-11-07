import { setAllAdminDonations } from '@/redux/donationSlice';
import { DONATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminDonations = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminDonations = async () => {
            try {
                const res = await axios.get(`${DONATION_API_END_POINT}/getdonordonations`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAdminDonations(res.data.donations));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllAdminDonations();
    }, [dispatch]);
};

export default useGetAllAdminDonations;
