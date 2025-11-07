import { setAllAppliedDonations } from "@/redux/donationSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedDonations = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedDonations = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAppliedDonations(res.data.applications));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAppliedDonations();
    }, [dispatch]);
};

export default useGetAppliedDonations;
