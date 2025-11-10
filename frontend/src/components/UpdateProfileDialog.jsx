import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

// This component is for updating the LICENSE, not the profile photo.
const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // --- FIX: State for the new LICENSE file ---
  const [newFile, setNewFile] = useState(null); // Holds the new File object
  const [existingLicenseUrl, setExistingLicenseUrl] = useState(user?.profile?.license || "");
  const [existingLicenseName, setExistingLicenseName] = useState(user?.profile?.licenseOriginalName || "");

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    about: user?.profile?.about || "",
    address: user?.profile?.address || "",
  });

  // Reset form when dialog opens/closes or user data changes
  useEffect(() => {
    // Reset text inputs
    setInput({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      about: user?.profile?.about || "",
      address: user?.profile?.address || "",
    });
    // Reset file inputs
    setExistingLicenseUrl(user?.profile?.license || "");
    setExistingLicenseName(user?.profile?.licenseOriginalName || "");
    setNewFile(null);
  }, [open, user]); // Re-run if 'open' or 'user' changes

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return; // User cancelled
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File too large! Max 5MB.");
      return;
    }
    console.log("Selected file:", file);
    setNewFile(file); // Store the File object
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("about", input.about);
    formData.append("address", input.address);

    if (newFile) {
      formData.append("file", newFile); // Backend expects 'file'
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        // --- FIX: Update state with LICENSE info from response ---
        setExistingLicenseUrl(res.data.user?.profile?.license || "");
        setExistingLicenseName(res.data.user?.profile?.licenseOriginalName || "");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
      setNewFile(null); // Clear the file selection
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-4 py-4'>

            
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="fullname" className="text-right">Name</Label>
              <Input id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="phoneNumber" className="text-right">Number</Label>
              <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="about" className="text-right">About</Label>
              <Input id="about" name="about" value={input.about} onChange={changeEventHandler} className="col-span-3" />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="address" className="text-right">Address</Label>
              <Input id="address" name="address" value={input.address} onChange={changeEventHandler} className="col-span-3" />
            </div>

            {/* license / not profilePhoto */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="license" className="text-right">License</Label>
             <div className="col-span-3">
              

                {(newFile || existingLicenseUrl) && (
                  <div className="flex flex-col gap-1 mb-2">
                    <p className="text-xs text-gray-500">
                      {newFile ? `New File: ${newFile.name}` : "Current File:"}
                  </p>
                  
                    {!newFile && existingLicenseUrl && (
                      <a
                        target='_blank'
                        href={existingLicenseUrl}
                        rel="noopener noreferrer" // Good practice for target='_blank'
                        className='text-blue-500 text-xs hover:underline'
                      >
                        {existingLicenseName || "View File"}
                      </a>
                    )}
                  </div>
                )}
                <Input
                  id="license"
                  name="license"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={fileChangeHandler}
                  className=""
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4 bg-[#F83002]" disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4 bg-[#F83002]">Update</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog