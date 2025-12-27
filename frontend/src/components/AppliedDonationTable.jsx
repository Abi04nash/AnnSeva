import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import useGetAppliedDonations from '@/hooks/useGetAppliedDonations'

const AppliedDonationTable = () => {
  useGetAppliedDonations();
    const { allAppliedDonations } = useSelector(store => store.donation);

    return (
        <div>
            <Table>
                <TableCaption>A list of your requested donations</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black font-bold text-lg">Date</TableHead>
                        <TableHead className="text-black font-bold text-lg">Donation Type</TableHead>
                        <TableHead className="text-black font-bold text-lg">Source</TableHead>
                        <TableHead className="text-black font-bold text-lg">Location</TableHead>
                        <TableHead className="text-black text-right font-bold text-lg">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
  {Array.isArray(allAppliedDonations) && allAppliedDonations.length > 0 ? (
    allAppliedDonations.map((donation) => (
      <TableRow className=" bg-amber-50 rounded-xl" key={donation._id}>
        <TableCell>{donation?.createdAt?.split("T")[0]}</TableCell>
        <TableCell>{donation?.donation?.donationType}</TableCell>
        <TableCell>{donation?.donation?.donor?.name}</TableCell>
        <TableCell>{donation?.donation?.pickupLocation}</TableCell>
        <TableCell className="text-right">
          <Badge
            className={`${
              donation?.status === "rejected"
                ? "bg-red-500"
                : donation?.status === "pending"
                ? "bg-yellow-400"
                : "bg-green-400"
            }`}
          >
            {donation?.status?.toUpperCase()}
          </Badge>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} className="text-center text-gray-500">
        You haven’t requested any donations yet.
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
        </div>
    )
}

export default AppliedDonationTable



