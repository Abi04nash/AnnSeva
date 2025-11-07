import { setAllDonations } from '@/redux/donationSlice';
import { DONATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllDonations = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((store) => store.donation);

    useEffect(() => {
        const fetchAllDonations = async () => {
            try {
                const res = await axios.get(`${DONATION_API_END_POINT}/get?keyword=${searchedQuery}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllDonations(res.data.donations));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllDonations();
    }, [searchedQuery, dispatch]);
};

export default useGetAllDonations;

