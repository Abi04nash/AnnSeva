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
import { Delete, Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DONATION_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setAllAdminDonations } from '@/redux/donationSlice'


const AdminDonationsTable = () => {
  const { allAdminDonations, searchDonationByText } = useSelector(store => store.donation);
  const dispatch = useDispatch();

  const [filterDonations, setFilterDonations] = useState(allAdminDonations);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchAdminDonations = async () => {
    try {
      const res = await axios.get(
        `${DONATION_API_END_POINT}/admin`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAllAdminDonations(res.data.donations));
      }
    } catch (err) {
      console.log(err);
    }
  };

  fetchAdminDonations();
}, []);


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

  const handleDelete = async (donationId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this donation? All requests will also be deleted."
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      `${DONATION_API_END_POINT}/delete/${donationId}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      // 🔥 UI se bhi remove kar
      const updatedDonations = allAdminDonations.filter(
        (d) => d._id !== donationId
      );
      dispatch(setAllAdminDonations(updatedDonations));
    }
  } catch (error) {
    console.log("Delete error:", error);
  }
};


  return (
    <div>
      <Table>
        <TableCaption>A list of your recently posted food donations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black font-bold text-lg">Source Name</TableHead>
            <TableHead className="text-black font-bold text-lg">Donation Type</TableHead>
            <TableHead className="text-black font-bold text-lg">Freshness(10)</TableHead>
            <TableHead className="font-bold text-black text-lg">Quantity</TableHead>
            <TableHead className="font-bold text-black text-lg">Location</TableHead>
            <TableHead className="text-black font-bold text-lg">Status</TableHead>
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
              <TableCell>
  <span className={`px-2 py-1 rounded-md ${
    donation.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }`}>
    {donation.status}
  </span>
</TableCell>

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

                    <button className='flex items-center w-fit gap-2 cursor-pointer mt-2' onClick={() => handleDelete(donation._id)}>
 <Delete className='w-4' /><span>Delete</span>
</button>

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
