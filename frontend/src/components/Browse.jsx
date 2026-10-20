import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Donation from './Donation'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setAllDonations } from '@/redux/donationSlice'
import { DONATION_API_END_POINT } from '@/utils/constant'
import DonationMap from '@/components/DonationMap'
import { MapPin, Globe2, AlertCircle } from 'lucide-react'

const Browse = () => {
    const dispatch = useDispatch()
    const { allDonations } = useSelector(store => store.donation)
    const activeDonationsList = allDonations.filter(donation => donation.status === 'active')

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
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-8">
                
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-2xl">
                            <Globe2 className="w-7 h-7 text-[#F83002]" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
                                Explore Donations
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                Discover and claim live food donations near you
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0">
                        <span className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-gray-700">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            {activeDonationsList.length} Active Listings
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* MAP Section */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 h-fit space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-[#F83002]" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">Live Tracker</h2>
                                    <p className="text-xs text-gray-500 font-medium">Real-time mapping</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 ring-4 ring-white bg-white">
                            <DonationMap donations={allDonations} />
                        </div>
                    </div>

                    {/* Donation cards */}
                    <div className="lg:col-span-3">
                        {allDonations.length === 0 ? (
                            // Premium Empty State
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center h-[500px]">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Donations Found</h3>
                                <p className="text-gray-500 max-w-sm">
                                    There are currently no active food donations available. Please check back later.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
                                {allDonations.map((donation) => (
                                    <Donation
                                        key={donation._id}
                                        donation={donation}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Browse