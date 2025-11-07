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
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminDonationsTable = () => {
  const { allAdminDonations, searchDonationByText } = useSelector(store => store.donation);
  const [filterDonations, setFilterDonations] = useState(allAdminDonations);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminDonations.filter((donation) => {
      if (!searchDonationByText) return true;
      return (
        donation?.title?.toLowerCase().includes(searchDonationByText.toLowerCase()) ||
        donation?.donor?.name?.toLowerCase().includes(searchDonationByText.toLowerCase())
      );
    });
    setFilterDonations(filtered);
  }, [allAdminDonations, searchDonationByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently posted food donations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black font-bold text-lg">Donor Name</TableHead>
            <TableHead className="text-black font-bold text-lg">Donation Type</TableHead>
            <TableHead className="text-black font-bold text-lg">Freshness(10)</TableHead>
            <TableHead className="font-bold text-black text-lg">Quantity</TableHead>
            <TableHead className="font-bold text-black text-lg">Location</TableHead>
            <TableHead className="font-bold text-black text-lg">Date</TableHead>
            <TableHead className=" font-bold text-black text-lg text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterDonations?.map((donation) => (
            <TableRow className="bg-amber-50" key={donation._id}>
              <TableCell>{donation?.donor?.name}</TableCell>
              <TableCell>{donation?.donationType}</TableCell>
              <TableCell>{donation?.freshnessLevel}</TableCell>
              <TableCell>{donation?.quantity}</TableCell>
              <TableCell>{donation?.pickupLocation}</TableCell>
              <TableCell>{donation?.createdAt?.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                     onClick={() => navigate(`/admin/donations/${donation._id}/edit`)}
                      className='flex items-center gap-2 w-fit cursor-pointer'
                    >
                      <Edit2 className='w-4' />
                      <span>Edit</span>
                    </div>

                    <div
                      onClick={() => navigate(`/admin/donations/${donation._id}/applicants`)}
                      className='flex items-center w-fit gap-2 cursor-pointer mt-2'
                    >
                      <Eye className='w-4' />
                      <span>Receivers</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminDonationsTable
