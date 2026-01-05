import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminDonationsTable from './AdminDonationsTable'
import useGetAllAdminDonations from '@/hooks/useGetAllAdminDonations'
import { setSearchDonationByText } from '@/redux/donationSlice'
import {
    Utensils,
} from "lucide-react";

const AdminDonations = () => {
  useGetAllAdminDonations();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchDonationByText(input));
  }, [input]);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='tab flex p-1 lg:p-0 items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by food type or donor"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="bg-[#F83002]" onClick={() => navigate("/admin/donations/create")}>
            {/* <Utensils className="w-2 h-2"/> */}
            New Donation
          </Button>
        </div>
        <AdminDonationsTable />
      </div>
    </div>
  )
}

export default AdminDonations
