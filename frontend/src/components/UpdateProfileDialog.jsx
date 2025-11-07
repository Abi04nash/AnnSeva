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
import { DialogDescription } from './ui/dialog' // Added for a11y warning

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // 🔥 1. Separate State for New File and Existing URL
  const [newFile, setNewFile] = useState(null); // Holds the new File object
  const [existingLicenseUrl, setExistingLicenseUrl] = useState(user?.profile?.license || ""); // Holds the existing image URL

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    about: user?.profile?.about || "",
    address: user?.profile?.address || "",
    // 🔥 Removed 'file' from here to prevent file input value conflict
  });

  useEffect(() => {
    if (!open) {
      // Reset input fields to current user data
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        about: user?.profile?.about || "",
        address: user?.profile?.address || "",
      });
      // Reset file states
      setExistingLicenseUrl(user?.profile?.license || "");
      setNewFile(null); 
    }
  }, [open, user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
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
    
    // 🔥 2. Conditional append: Use the separate state for the new file
    if (newFile) {
      formData.append("license", newFile);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        // Update the existing license URL state with the new URL from the response
        setExistingLicenseUrl(res.data.user?.profile?.license || "");
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
          {/* Optional: Add Description for accessibility (as discussed) */}
          {/* <DialogDescription>Update your personal information and license image.</DialogDescription> */}
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-4 py-4'>
            {/* ... (Your existing input fields) ... */}
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
            
            {/* 🔑 License Field - Change accept to image/* and add display logic */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor="license" className="text-right">License</Label>
              
              <div className="col-span-3">
                 {/* 3. Display existing image or selected image preview */}
                {(newFile || existingLicenseUrl) && (
                  <div className="flex flex-col gap-1 mb-2">
                     <p className="text-xs text-gray-500">
                        {newFile ? `New Image: ${newFile.name}` : "Current Image:"}
                    </p>
                    <img 
                       src={newFile ? URL.createObjectURL(newFile) : existingLicenseUrl}
                       alt="License Image Preview" 
                       className="w-16 h-16 object-cover border rounded" 
                    />
                  </div>
                )}

                <Input 
                  id="license" 
                  name="license" 
                  type="file" 
                  accept="image/*" // 🔥 Changed to accept images
                  onChange={fileChangeHandler} 
                  className="" 
                  // ⚠️ IMPORTANT: Removed value={input.file} 
                  // to allow new file selection after initial load
                />
              </div>

            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4 bg-[#F83002]">
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