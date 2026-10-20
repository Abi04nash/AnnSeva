import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { DONATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, HeartHandshake } from 'lucide-react';

const PostDonation = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    items: "",
    quantity: "",
    pickupLocation: "",
    donationType: "",
    freshnessLevel: "",
    availableUnits: "",
    donorId: "",
    expiryHours: 1
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { donors } = useSelector(store => store.donor);
  const { id } = useParams(); // if id exists => edit mode

  // Fetch donation data if updating
  useEffect(() => {
    if (id) {
      const fetchDonation = async () => {
        try {
          const res = await axios.get(`${DONATION_API_END_POINT}/get/${id}`, { withCredentials: true });
          if (res.data.success) {
            const d = res.data.donation;

            const now = new Date();
            const expiryDate = new Date(d.expiryAt);
            let remainingHours = Math.ceil((expiryDate - now) / (1000 * 60 * 60));
            if (remainingHours < 1) remainingHours = 1;


            setInput({
              title: d.title,
              description: d.description,
              items: d.items.join(", "),
              quantity: d.quantity,
              pickupLocation: d.pickupLocation,
              donationType: d.donationType,
              freshnessLevel: d.freshnessLevel,
              availableUnits: d.availableUnits,
              donorId: d.donor?._id || "",
              expiryHours: remainingHours
            });
          }
        } catch (error) {
          toast.error("Failed to fetch donation details");
        }
      };
      fetchDonation();
    }
  }, [id]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    
    if (name === "quantity") {
      setInput({ ...input, quantity: value, availableUnits: value });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const selectChangeHandler = (value) => {
    const selectedDonor = donors.find((donor) => donor.name.toLowerCase() === value);
    setInput({ ...input, donorId: selectedDonor._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...input,
        items: input.items.split(",").map(i => i.trim()),
        expiryAt: new Date(Date.now() + input.expiryHours * 60 * 60 * 1000) 
      };

      let res;
      if (id) {
        res = await axios.put(`${DONATION_API_END_POINT}/update/${id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      } else {
        res = await axios.post(`${DONATION_API_END_POINT}/post`, payload, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/donations");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <div className='flex items-center justify-center w-full px-4 sm:px-6 my-10'>
        <form onSubmit={submitHandler} className='w-full max-w-4xl bg-white p-6 sm:p-10 border border-gray-100 shadow-xl rounded-3xl'>
          
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <HeartHandshake className="w-8 h-8 text-[#F83002]" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {id ? "Update Donation" : "Post New Donation"}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Provide details about the food to help it reach those in need.</p>
          </div>

          {/* Form Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all"
                placeholder="e.g. 50 Packets of Biryani"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all"
                placeholder="Brief details about the food"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Items (Comma separated)</Label>
              <Input
                type="text"
                name="items"
                value={input.items}
                onChange={changeEventHandler}
                placeholder="e.g. rice, dal, biscuits"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Quantity (Total Units)</Label>
              <Input
                type="number"
                name="quantity"
                value={input.quantity}
                onChange={changeEventHandler}
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all"
                placeholder="e.g. 50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Pickup Location</Label>
              <Input
                type="text"
                name="pickupLocation"
                value={input.pickupLocation}
                onChange={changeEventHandler}
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all"
                placeholder="e.g. MG Road, Pune"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="donationType" className="text-gray-700 font-semibold">Donation Type</Label>
              <select
                id="donationType"
                name="donationType"
                value={input.donationType}
                onChange={changeEventHandler}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F83002] cursor-pointer transition-all"
              >
                <option value="" disabled>Select a donation type...</option>
                <option value="Foods">Foods</option>
                <option value="Groceries">Groceries</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Snacks">Snacks</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Freshness Level (1-10)</Label>
              <Input
                type="number"
                name="freshnessLevel"
                value={input.freshnessLevel}
                onChange={(e) => {
                  if (e.target.value === "" || (Number(e.target.value) >= 1 && Number(e.target.value) <= 10)) {
                    changeEventHandler(e);
                  }
                }}
                min="1"
                max="10"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Expiry Time (in hours)</Label>
              <Select value={String(input.expiryHours)} onValueChange={(value) => setInput({ ...input, expiryHours: Number(value) })}>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all">
                  <SelectValue placeholder="Select hours">
                    {input.expiryHours ? `${input.expiryHours} hour(s)` : "Select hours"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectGroup>
                    {Array.from({ length: 25 }, (_, i) => i + 1).map(hour => (
                      <SelectItem key={hour} value={String(hour)} className="cursor-pointer hover:bg-orange-50">
                        {hour} hour{hour > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-500 font-semibold">Available Units (Auto-filled)</Label>
              <Input
                type="number"
                name="availableUnits"
                value={input.availableUnits}
                onChange={changeEventHandler}
                readOnly
                className="bg-gray-100 cursor-not-allowed text-gray-500 rounded-xl h-11 focus-visible:ring-0 border-transparent shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Source (Registered Donor)</Label>
              {donors.length > 0 && (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus-visible:ring-[#F83002] rounded-xl h-11 transition-all">
                    <SelectValue placeholder="Select a Donor" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectGroup>
                      {donors.map((donor) => (
                        <SelectItem key={donor._id} value={donor?.name?.toLowerCase()} className="cursor-pointer hover:bg-orange-50">
                          {donor.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="mt-10">
            {loading ? (
              <Button className="w-full rounded-xl h-14 text-base font-bold bg-[#F83002]/80 cursor-not-allowed" disabled>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-[#F83002] hover:bg-[#d82800] text-white rounded-xl h-14 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {id ? "Update Donation" : "Post Donation"}
              </Button>
            )}

            {donors.length === 0 && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-semibold border border-red-100 flex items-center justify-center gap-2">
                 ⚠️ <span>Please register a donor source first before posting a donation.</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostDonation;