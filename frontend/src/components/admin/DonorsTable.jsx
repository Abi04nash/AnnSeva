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
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Calendar, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DonorsTable = () => {
    const { donors, searchDonorByText } = useSelector(store => store.donor)
    const [filteredDonors, setFilteredDonors] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!Array.isArray(donors)) {
            setFilteredDonors([])
            return
        }
        const filtered = donors.filter(donor => {
            if (!searchDonorByText) return true
            return donor?.name?.toLowerCase().includes(searchDonorByText.toLowerCase())
        })
        setFilteredDonors(filtered)
    }, [donors, searchDonorByText])

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="border-collapse w-full">
                    {filteredDonors.length === 0 ? (
                        <TableCaption className="py-10 text-gray-500">
                            No sources found.
                        </TableCaption>
                    ) : (
                        <TableCaption className="pb-4">
                            A list of your registered food sources
                        </TableCaption>
                    )}

                    {/* HEADER */}
                    <TableHeader className="bg-gray-50 border-b border-gray-300">
                        <TableRow>
                            {['Logo', 'Source Name', 'Type', 'Registered Date', 'Action'].map(
                                (head, i) => (
                                    <TableHead
                                        key={i}
                                        className={`py-4 px-6 text-xs font-bold whitespace-nowrap text-black uppercase tracking-wider border-r border-gray-300 last:border-r-0 ${head === 'Action' ? 'text-center' : 'text-left'
                                            }`}
                                    >
                                        {head}
                                    </TableHead>
                                )
                            )}
                        </TableRow>
                    </TableHeader>

              
                    <TableBody>
                        {filteredDonors.map(donor => (
                            <TableRow
                                key={donor._id}
                                className="bg-orange-50 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                            >
                          
                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        <AvatarImage
                                            src={donor.logo}
                                            alt={donor.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-orange-100 text-[#F83002] font-bold">
                                            {donor.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>

                                <TableCell className="px-6 py-4 text-left border-r border-gray-200 text-gray-900">
                                    {donor.name}
                                </TableCell>

                      
                                <TableCell className="px-6 py-4 text-left border-r border-gray-200">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-100">
                                        <Building2 className="w-3 h-3" />
                                        {donor.donorType.replace(/_/g, ' ')}
                                    </span>
                                </TableCell>

                           
                                <TableCell className="px-6 py-4 text-left border-r border-gray-200 text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-gray-800" />
                                        {donor.createdAt?.split('T')[0]}
                                    </div>
                                </TableCell>

                                <TableCell className="px-6 py-4 text-center">
                                    <Popover>
                                        <PopoverTrigger>
                                            <div className="p-2 hover:bg-gray-200 rounded-full cursor-pointer inline-block">
                                                <MoreHorizontal className="w-5 h-5 text-gray-900" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 p-1 bg-white border border-gray-200 shadow-lg rounded-xl mr-4">
                                            <div
                                                onClick={() => navigate(`/admin/donors/${donor._id}`)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
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



export default DonorsTable