import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Label } from './ui/label'
import AppliedDonationTable from './AppliedDonationTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import SavedDonations from './SavedDonations';
// import useGetAppliedDonations from '@/hooks/useGetAppliedDonations'

const Profile = () => {
  // useGetAppliedDonations();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState("saved");


  return (
    <div>
      <Navbar />
      <div className='max-w-4xl mx-2 lg:mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-4'>
        <div className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar className="h-12 w-12">
              {!user?.profile?.profilePhoto ? (<AvatarImage src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />) : (<AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />)}
            </Avatar>
            <div>
              <h1 className='font-medium text-xl'>{user?.fullname}</h1>
              <p>{user?.profile?.about}</p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen className="text-[#F83002]" /></Button>
        </div>

        <div className='my-5'>

          <div className='flex items-center gap-3 my-2'>
            <Mail className='' />
            <span className="text-md text-gray-500 font-bold">{user?.email}</span>
          </div>

          <div className='flex items-center gap-3 my-2'>
            <Contact className='' />

            <span className="text-md text-gray-500 font-bold">{user?.phoneNumber}</span>
          </div>
        </div>

        <div className='my-5'>
          <h1 className="text-md font-bold ">Address</h1>
          <div className='flex items-center gap-1'>
            {user?.profile?.address ? (
              <span className='text-md text-gray-500 font-bold'>{user.profile.address}</span>
            ) : (
              <span>Not Mentioned</span>
            )}
          </div>
        </div>

        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label className="text-md font-bold ">Licence</Label>
          {user?.profile?.license ? (
            <a
              target='_blank'
              href={user?.profile?.license}
              className='text-blue-500 text-md w-full hover:underline cursor-pointer'
            >
              <p className='text-sm'>{user?.profile?.licenseOriginalName}</p>
            </a>
          ) : (
            <span className='text-md font-bold'>Not Available</span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-0 mt-6">
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition
        ${activeTab === "saved"
                ? "bg-white text-[#F83002] shadow"
                : "text-gray-500 hover:text-black"
              }`}
          >
            Watchlist
          </button>

          <button
            onClick={() => setActiveTab("applied")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition
        ${activeTab === "applied"
                ? "bg-white text-[#F83002] shadow"
                : "text-gray-500 hover:text-black"
              }`}
          >
            Applied Donations
          </button>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-0 my-6">
        {activeTab === "saved" && (
          <div className="bg-white rounded-2xl p-4 shadow">
           
            <SavedDonations />
          </div>
        )}

        {activeTab === "applied" && (
          <div className="bg-white rounded-2xl p-4 shadow">
            <h1 className='font-bold text-lg text-center my-5'>
              Your <span className='text-[#F83002]'>Donation</span> Applications
            </h1>
            <AppliedDonationTable />
          </div>
        )}
      </div>



      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile




