import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table'
import { useSelector } from 'react-redux'
import useGetAppliedDonations from '@/hooks/useGetAppliedDonations'
import { Calendar, MapPin, Building2, Tag } from 'lucide-react'

const AppliedDonationTable = () => {
    useGetAppliedDonations()
    const { allAppliedDonations } = useSelector(store => store.donation)

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="border-collapse w-full">
                    {Array.isArray(allAppliedDonations) && allAppliedDonations.length === 0 ? (
                        <TableCaption className="py-10 text-gray-500">
                            You haven't requested any donations yet.
                        </TableCaption>
                    ) : (
                        <TableCaption className="pb-4">
                            A list of your requested donations
                        </TableCaption>
                    )}


                    <TableHeader className="bg-gray-50 border-b border-gray-300">
                        <TableRow>
                            {["Date", "Donation Type", "Source", "Location", "Status"].map(
                                (head, i) => (
                                    <TableHead
                                        key={i}
                                        className="py-4 px-6 text-xs font-bold whitespace-nowrap text-gray-900 uppercase tracking-wider text-left border-r border-gray-300 last:border-r-0"
                                    >
                                        {head}
                                    </TableHead>
                                )
                            )}
                        </TableRow>
                    </TableHeader>


                    <TableBody>
                        {Array.isArray(allAppliedDonations) &&
                            allAppliedDonations.length > 0 &&
                            allAppliedDonations.map(donation => (
                                <TableRow
                                    key={donation._id}
                                    className="bg-orange-50 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                                >

                                    <TableCell className="px-6 py-4 text-left border-r whitespace-nowrap border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-gray-800" />
                                            {donation?.createdAt?.split('T')[0]}
                                        </div>
                                    </TableCell>


                                    <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                        <div className="flex items-center gap-1.5">
                                            <Tag className="w-3 h-3 text-gray-800" />
                                            {donation?.donation?.donationType}
                                        </div>
                                    </TableCell>


                                    <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-orange-100 flex items-center justify-center text-[#F83002]">
                                                <Building2 className="w-3 h-3" />
                                            </div>
                                            {donation?.donation?.donor?.name}
                                        </div>
                                    </TableCell>


                                    <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-gray-800" />
                                            <span className="truncate max-w-[180px]">
                                                {donation?.donation?.pickupLocation}
                                            </span>
                                        </div>
                                    </TableCell>


                                    <TableCell className="px-6 py-4 text-left">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                        ${donation?.status === 'declined'
                                                    ? 'bg-red-100 text-red-700 border-red-200'
                                                    : donation?.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                        : 'bg-green-100 text-green-700 border-green-200'
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full mr-1.5 
                          ${donation?.status === 'declined'
                                                        ? 'bg-red-600'
                                                        : donation?.status === 'pending'
                                                            ? 'bg-yellow-600'
                                                            : 'bg-green-600'
                                                    }`}
                                            />
                                            {donation?.status?.toUpperCase()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AppliedDonationTable