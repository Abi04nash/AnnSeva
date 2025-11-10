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
import { Loader2 } from 'lucide-react';

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
    donorId: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { donors } = useSelector(store => store.donor);
  const { id } = useParams(); // ✅ if id exists => edit mode

  // 🔹 Fetch donation data if updating
  useEffect(() => {
    if (id) {
      const fetchDonation = async () => {
        try {
          const res = await axios.get(`${DONATION_API_END_POINT}/get/${id}`, { withCredentials: true });
          if (res.data.success) {
            const d = res.data.donation;
            setInput({
              title: d.title,
              description: d.description,
              items: d.items.join(", "),
              quantity: d.quantity,
              pickupLocation: d.pickupLocation,
              donationType: d.donationType,
              freshnessLevel: d.freshnessLevel,
              availableUnits: d.availableUnits,
              donorId: d.donor?._id || ""
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
    setInput({ ...input, [e.target.name]: e.target.value });
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
      };

      let res;
      if (id) {
        // Update donation
        res = await axios.put(`${DONATION_API_END_POINT}/update/${id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      } else {
        // Create new donation
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
    <div>
      <Navbar />
      <div className='flex items-center  justify-center w-screen my-5'>
        <form onSubmit={submitHandler} className='mx-2 p-4 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
          <h1 className="text-2xl font-bold mb-5 text-center">
            {id ? "Update Donation" : "Post New Donation"}
          </h1>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Items()</Label>
              <Input
                type="text"
                name="items"
                value={input.items}
                onChange={changeEventHandler}
                placeholder="e.g. rice, dal, biscuits"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                name="quantity"
                value={input.quantity}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Pickup Location</Label>
              <Input
                type="text"
                name="pickupLocation"
                value={input.pickupLocation}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Donation Type</Label>
              <Input
                type="text"
                name="donationType"
                value={input.donationType}
                onChange={changeEventHandler}
                placeholder="e.g. Food / Clothes / Groceries"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Freshness Level (1-10)</Label>
              <Input
                type="number"
                name="freshnessLevel"
                value={input.freshnessLevel}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Available Units</Label>
              <Input
                type="number"
                name="availableUnits"
                value={input.availableUnits}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {donors.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Donor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {donors.map((donor) => (
                      <SelectItem key={donor._id} value={donor?.name?.toLowerCase()}>
                        {donor.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>

          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="bg-[#F83002] w-full my-4">
              {id ? "Update Donation" : "Post Donation"}
            </Button>
          )}

          {donors.length === 0 && (
            <p className='text-xs text-red-600 font-bold text-center my-3'>
              *Please register a donor first before posting a donation
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostDonation;
