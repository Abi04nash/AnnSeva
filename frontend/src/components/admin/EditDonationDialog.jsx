import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { DONATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditDonationDialog = ({ open, setOpen, donation }) => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    items: "",
    quantity: "",
    pickupLocation: "",
    donationType: "",
    freshnessLevel: "",
    availableUnits: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donation) {
      setInput({
        title: donation.title || "",
        description: donation.description || "",
        items: donation.items?.join(", ") || "",
        quantity: donation.quantity || "",
        pickupLocation: donation.pickupLocation || "",
        donationType: donation.donationType || "",
        freshnessLevel: donation.freshnessLevel || "",
        availableUnits: donation.availableUnits || "",
      });
    }
  }, [donation]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`${DONATION_API_END_POINT}/update/${donation._id}`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setSingleDonation(res.data.donation));
        toast.success(res.data.message || "Donation updated successfully!");
        const donationID = res?.data?.donation?._id;
        navigate(`/admin/donations/${donationID}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Donation</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="grid gap-3">
          <Label>Title</Label>
          <Input name="title" value={input.title} onChange={changeEventHandler} />

          <Label>Description</Label>
          <Input name="description" value={input.description} onChange={changeEventHandler} />

          <Label>Items</Label>
          <Input name="items" value={input.items} onChange={changeEventHandler} />

          <Label>Quantity</Label>
          <Input name="quantity" value={input.quantity} onChange={changeEventHandler} />

          <Label>Pickup Location</Label>
          <Input name="pickupLocation" value={input.pickupLocation} onChange={changeEventHandler} />

          <Label>Donation Type</Label>
          <Input name="donationType" value={input.donationType} onChange={changeEventHandler} />

          <Label>Freshness Level</Label>
          <Input name="freshnessLevel" value={input.freshnessLevel} onChange={changeEventHandler} />

          <Label>Available Units</Label>
          <Input name="availableUnits" value={input.availableUnits} onChange={changeEventHandler} />

          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </Button>
          ) : (
            <Button type="submit" className="bg-[#F83002] text-white">
              Update Donation
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDonationDialog;
