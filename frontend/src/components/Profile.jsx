import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Mail, Pen, Phone, MapPin, FileText } from 'lucide-react'
import { Label } from './ui/label'
import AppliedDonationTable from './AppliedDonationTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import SavedDonations from './SavedDonations';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState("applied");

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Navbar />
      
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
        
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative'>
          
          <div className="h-32 w-full bg-gradient-to-r from-orange-100 via-red-50 to-orange-100"></div>

          <div className='px-6 sm:px-10 pb-8'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 sm:-mt-16 mb-6 gap-4'>
              
              <div className='flex flex-col sm:flex-row items-start sm:items-end gap-5'>
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg bg-white">
                  {!user?.profile?.profilePhoto ? (
                    <AvatarImage src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />
                  ) : (
                    <AvatarImage src={user?.profile?.profilePhoto} alt="user" className="object-cover" />
                  )}
                </Avatar>
                
                <div className="mb-1">
                  <h1 className='font-extrabold text-2xl text-gray-900'>{user?.fullname}</h1>
                  <p className='text-gray-500 font-medium text-sm mt-1 max-w-md line-clamp-2'>
                    {user?.profile?.about || "No description provided."}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setOpen(true)} 
                variant="outline" 
                className="rounded-full px-6 font-semibold border-gray-200 hover:bg-orange-50 hover:text-[#F83002] hover:border-orange-200 transition-all shadow-sm"
              >
                <Pen className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>

            <hr className="border-gray-100 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors'>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Mail className='w-5 h-5 text-[#F83002]' />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                  <span className="text-sm font-semibold text-gray-900">{user?.email}</span>
                </div>
              </div>

              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors'>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Phone className='w-5 h-5 text-[#F83002]' />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</p>
                  <span className="text-sm font-semibold text-gray-900">{user?.phoneNumber || "Not Mentioned"}</span>
                </div>
              </div>

              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors'>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <MapPin className='w-5 h-5 text-[#F83002]' />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</p>
                  <span className="text-sm font-semibold text-gray-900">{user?.profile?.address || "Not Mentioned"}</span>
                </div>
              </div>

              <div className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors'>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <FileText className='w-5 h-5 text-[#F83002]' />
                </div>
                <div className="w-full">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">License</p>
                  {user?.profile?.license ? (
                    <a
                      target='_blank'
                      rel="noreferrer"
                      href={user?.profile?.license}
                      className='text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate block w-48'
                    >
                      {user?.profile?.licenseOriginalName || "View License"}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-gray-900">Not Available</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 mb-6">
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 relative">
            <button
              onClick={() => setActiveTab("applied")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10
                ${activeTab === "applied" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Applied Donations
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10
                ${activeTab === "saved" ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Watchlist
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === "applied" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-8 bg-[#F83002] rounded-full"></div>
                <h1 className='font-bold text-xl text-gray-900'>
                  Your Applications
                </h1>
              </div>
              <AppliedDonationTable />
            </div>
          )}

          {activeTab === "saved" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-8 bg-[#F83002] rounded-full"></div>
                <h1 className='font-bold text-xl text-gray-900'>
                  Your Watchlist
                </h1>
              </div>
              <SavedDonations />
            </div>
          )}
        </div>

      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile


