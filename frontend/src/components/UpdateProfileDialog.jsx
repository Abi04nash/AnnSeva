import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, FileText, CheckCircle2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const [newFile, setNewFile] = useState(null); 
  const [existingLicenseUrl, setExistingLicenseUrl] = useState(user?.profile?.license || "");
  const [existingLicenseName, setExistingLicenseName] = useState(user?.profile?.licenseOriginalName || "");

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    about: user?.profile?.about || "",
    address: user?.profile?.address || "",
  });

  useEffect(() => {
    setInput({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      about: user?.profile?.about || "",
      address: user?.profile?.address || "",
    });
    setExistingLicenseUrl(user?.profile?.license || "");
    setExistingLicenseName(user?.profile?.licenseOriginalName || "");
    setNewFile(null);
  }, [open, user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return; 
    if (file.size > 5 * 1024 * 1024) { 
      toast.error("File too large! Max 5MB.");
      return;
    }
    setNewFile(file); 
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
      formData.append("file", newFile); 
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
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
      setNewFile(null); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent className="w-[95vw] sm:max-w-[550px] max-h-[90vh] p-0 flex flex-col rounded-3xl bg-white border border-gray-100 shadow-2xl">
        
        <DialogHeader className="px-6 sm:px-8 pt-6 pb-4 bg-gray-50/50 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Update Profile</DialogTitle>
          <p className="text-sm text-gray-500 font-medium mt-1">Make changes to your personal and organization details.</p>
        </DialogHeader>

        <form onSubmit={submitHandler} className="flex flex-col overflow-hidden flex-1">
          <div className='flex flex-col gap-5 px-6 sm:px-8 py-6 overflow-y-auto flex-1'>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <div className="space-y-1.5">
                <Label htmlFor="fullname" className="text-gray-700 font-semibold text-sm">Full Name</Label>
                <Input id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} className="bg-gray-50 focus-visible:ring-[#F83002] rounded-xl h-11" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">Email Address</Label>
                <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="bg-gray-50 focus-visible:ring-[#F83002] rounded-xl h-11" placeholder="john@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold text-sm">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="bg-gray-50 focus-visible:ring-[#F83002] rounded-xl h-11" placeholder="e.g. 9876543210" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="about" className="text-gray-700 font-semibold text-sm">About / Bio</Label>
                <Input id="about" name="about" value={input.about} onChange={changeEventHandler} className="bg-gray-50 focus-visible:ring-[#F83002] rounded-xl h-11" placeholder="Brief description" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-gray-700 font-semibold text-sm">Full Address</Label>
              <Input id="address" name="address" value={input.address} onChange={changeEventHandler} className="bg-gray-50 focus-visible:ring-[#F83002] rounded-xl h-11" placeholder="e.g. 123 Main St, City, Country" />
            </div>

            <div className="space-y-2 mt-2">
              <Label htmlFor="license" className="text-gray-700 font-semibold text-sm">Organization License / Document</Label>
              
              <div className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-orange-50/30 transition-colors">
                
                {(newFile || existingLicenseUrl) && (
                  <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-2 bg-green-50 rounded-lg shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {newFile ? "New File Ready" : "Current Document"}
                      </span>
                      {!newFile && existingLicenseUrl ? (
                        <a
                          target='_blank'
                          href={existingLicenseUrl}
                          rel="noopener noreferrer"
                          className='text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate'
                        >
                          {existingLicenseName || "View License Document"}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {newFile?.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center w-full overflow-hidden">
                  <Input
                    id="license"
                    name="license"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={fileChangeHandler}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#F83002] hover:file:bg-orange-100 cursor-pointer w-full text-sm text-gray-500 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                  />
                </div>
              </div>
            </div>

          </div>

          <DialogFooter className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-white shrink-0">
            {loading ? (
              <Button className="w-full sm:w-auto px-8 rounded-xl h-11 text-base font-bold bg-[#F83002]/80" disabled>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full sm:w-auto px-8 rounded-xl h-11 text-base font-bold bg-[#F83002] hover:bg-[#d82800] text-white shadow-md hover:shadow-lg transition-all">
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog