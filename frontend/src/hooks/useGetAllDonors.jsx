import { setDonors } from '@/redux/donorSlice';
import { DONOR_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllDonors = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const res = await axios.get(`${DONOR_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setDonors(res.data.donors));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchDonors();
    }, [dispatch]);
};

export default useGetAllDonors;
