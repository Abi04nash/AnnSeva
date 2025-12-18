import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Donation from './Donation'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setAllDonations } from '@/redux/donationSlice'
import { DONATION_API_END_POINT } from '@/utils/constant'

const Browse = () => {
    const dispatch = useDispatch()
    const { allDonations } = useSelector(store => store.donation)

    useEffect(() => {
        const fetchAllDonations = async () => {
            try {
                const res = await axios.get(
                    `${DONATION_API_END_POINT}/get`,
                    { withCredentials: true }
                )

                if (res.data.success) {
                    dispatch(setAllDonations(res.data.donations))
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllDonations()
    }, [dispatch])

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="px-4 sm:px-6 lg:px-2 max-w-7xl mx-auto my-10">
                <h1 className="text-center lg:text-left font-bold text-xl my-6">
                    All Donations ({allDonations.length})
                </h1>

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-4
                    "
                >
                    {allDonations.map((donation) => (
                        <Donation
                            key={donation._id}
                            donation={donation}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Browse
