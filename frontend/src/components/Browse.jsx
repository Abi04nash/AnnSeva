import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Donation from './Donation'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/donationSlice'
import useGetAllDonations from '@/hooks/useGetAllDonations'

const Browse = () => {
    useGetAllDonations()
    const { allDonations } = useSelector(store => store.donation)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(''))
        }
    }, [dispatch])

    return (
        <div>
            <Navbar />
            <div className='md:px-2 max-w-7xl mx-auto my-10'>
                <h1 className='text-center lg:text-left font-bold text-xl my-10'>
                    Search Results ({allDonations.length})
                </h1>
                <div className='bro grid grid-cols-3 gap-4'>
                    {
                        allDonations.map((donation) => (
                            <Donation key={donation._id} donation={donation} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse

