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
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DonorsTable = () => {
  const { donors, searchDonorByText } = useSelector(store => store.donor);

  const [filteredDonors, setFilteredDonors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  
    if (!Array.isArray(donors)) {
      setFilteredDonors([]); 
      return; 
    }

   
    const filtered = donors.filter((donor) => {
      if (!searchDonorByText) return true; 
  
      return donor?.name?.toLowerCase().includes(searchDonorByText.toLowerCase());
    });

    setFilteredDonors(filtered); 

  }, [donors, searchDonorByText]);

  return (
    <div>
      <Table>
        <TableCaption>A list of recently registered food donors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=" text-black font-bold text-lg">Logo</TableHead>
            <TableHead className="font-bold text-black text-lg">Donor Name</TableHead>
            <TableHead className="font-bold text-black text-lg">Date</TableHead>
            <TableHead className="font-bold text-black text-lg text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        

          {filteredDonors?.map((donor) => (
            <TableRow className="bg-amber-50" key={donor._id}>
              <TableCell>
                <Avatar>

                  <AvatarImage src={donor.logo} alt={donor.name} />
                </Avatar>
              </TableCell>
              <TableCell>{donor.name}</TableCell>
              <TableCell>{donor.createdAt?.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/donors/${donor._id}`)}
                      className='flex items-center gap-2 w-fit cursor-pointer'
                    >
                      <Edit2 className='w-4' />
                        <span>Edit</span>
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

export default DonorsTable