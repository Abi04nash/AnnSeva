import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Trash2, Edit2, Eye, MoreHorizontal, MapPin, Leaf, Calendar } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DONATION_API_END_POINT } from '@/utils/constant'
import { setAllAdminDonations } from '@/redux/donationSlice'

const AdminDonationsTable = () => {
    const { allAdminDonations, searchDonationByText } = useSelector(store => store.donation)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [filterDonations, setFilterDonations] = useState(allAdminDonations)

    useEffect(() => {
        const fetchAdminDonations = async () => {
            try {
                const res = await axios.get(`${DONATION_API_END_POINT}/admin`, {
                    withCredentials: true,
                })
                if (res.data.success) {
                    dispatch(setAllAdminDonations(res.data.donations))
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchAdminDonations()
    }, [])

    useEffect(() => {
        const filtered = allAdminDonations.filter(donation => {
            if (!searchDonationByText) return true
            return (
                donation?.title?.toLowerCase().includes(searchDonationByText.toLowerCase()) ||
                donation?.donor?.name?.toLowerCase().includes(searchDonationByText.toLowerCase())
            )
        })
        setFilterDonations(filtered)
    }, [allAdminDonations, searchDonationByText])

    const handleDelete = async donationId => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this donation? All requests will also be deleted.'
        )
        if (!confirmDelete) return

        try {
            const res = await axios.delete(
                `${DONATION_API_END_POINT}/delete/${donationId}`,
                { withCredentials: true }
            )
            if (res.data.success) {
                dispatch(setAllAdminDonations(allAdminDonations.filter(d => d._id !== donationId)))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="border-collapse w-full">
                    {filterDonations.length === 0 ? (
                        <TableCaption className="py-10 text-gray-500">
                            No donations found.
                        </TableCaption>
                    ) : (
                        <TableCaption className="pb-4">
                            A list of your recently posted food donations
                        </TableCaption>
                    )}


                    <TableHeader className="bg-gray-50 border-b border-gray-300">
                        <TableRow>
                            {[
                                'Source Name',
                                'Type',
                                'Freshness',
                                'Quantity',
                                'Location',
                                'Status',
                                'Date',
                                'Action',
                            ].map((head, i) => (
                                <TableHead
                                    key={i}
                                    className={`py-4 px-6 text-xs font-bold whitespace-nowrap text-black uppercase tracking-wider border-r border-gray-300 last:border-r-0 ${head === 'Action' ? 'text-center' : 'text-left'
                                        }`}
                                >
                                    {head}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filterDonations.map(donation => (
                            <TableRow
                                key={donation._id}
                                className="bg-orange-50 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                            >

                                <TableCell className="px-6 py-4 text-left border-r text-orange-500 font-medium border-gray-200">
                                    {donation?.donor?.name}
                                </TableCell>


                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    {donation?.donationType}
                                </TableCell>


                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    <div className="flex items-center gap-1">
                                        <Leaf className="w-3 h-3" />
                                        {donation?.freshnessLevel}/10
                                    </div>
                                </TableCell>


                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    {donation?.quantity} Units
                                </TableCell>


                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-40">
                                            {donation?.pickupLocation}
                                        </span>
                                    </div>
                                </TableCell>


                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium border
                      ${donation.status === 'active'
                                                ? 'bg-green-100 text-green-700 border-green-100'
                                                : 'bg-red-100 text-red-700 border-red-100'
                                            }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${donation.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                                                }`}
                                        />
                                        {donation.status === 'active' ? 'Active' : 'Expired'}
                                    </span>
                                </TableCell>


                                <TableCell className="px-6 py-4 text-left border-r border-gray-200 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {donation?.createdAt?.split('T')[0]}
                                    </div>
                                </TableCell>


                                <TableCell className="px-6 py-4 text-center">
                                    <Popover>
                                        <PopoverTrigger>
                                            <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer inline-block">
                                                <MoreHorizontal className="w-5 h-5 text-gray-900" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-1 bg-white border border-gray-200 shadow-lg rounded-xl mr-4">
                                            <div
                                                onClick={() =>
                                                    navigate(`/admin/donations/${donation._id}/edit`)
                                                }
                                                className="flex items-center gap-2 px-3 py-1 text-sm font-medium hover:bg-gray-50 rounded-lg cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </div>

                                            <div
                                                onClick={() =>
                                                    navigate(`/admin/donations/${donation._id}/applicants`)
                                                }
                                                className="flex items-center gap-2 px-3 py-1 text-sm font-medium hover:bg-gray-50 rounded-lg cursor-pointer"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Applicants
                                            </div>

                                            <div
                                                onClick={() => handleDelete(donation._id)}
                                                className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer mt-1 border-t border-gray-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}



export default AdminDonationsTable