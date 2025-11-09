import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Donation from './Donation'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const Donations = () => {
    const { allDonations, searchedQuery } = useSelector(store => store.donation)
    // const [filteredDonations, setFilteredDonations] = useState([allDonations])
    const [filteredDonations, setFilteredDonations] = useState(allDonations)

useEffect(() => {
  if (searchedQuery && searchedQuery.value) {
    const filtered = allDonations.filter((donation) => {
      if (searchedQuery.type === "location") {
        return donation.pickupLocation?.toLowerCase().includes(searchedQuery.value.toLowerCase());
      }
      if (searchedQuery.type === "category") {
        return donation.donationType?.toLowerCase().includes(searchedQuery.value.toLowerCase());
      }
      return true;
    });
    setFilteredDonations(filtered);
  } else {
    setFilteredDonations(allDonations);
  }
}, [allDonations, searchedQuery]);


    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-8'>
                <div className='flex flex-col md:flex-row gap-5'>
                    {/* Filter Section */}
                    <div className='w-full md:w-[25%] lg:w-[20%]'>
                        <FilterCard />
                    </div>

                    {/* Donation Cards Section */}
                    {
                        filteredDonations.length <= 0 ? (
                            <span className='text-center w-full mt-10 text-gray-500 text-lg'>No donations found</span>
                        ) : (
                            <div className='flex-1 h-auto md:h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filteredDonations.map((donation, index) => (
                                            <motion.div
                                                key={`${donation?._id}-${index}`}
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Donation donation={donation} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Donations
