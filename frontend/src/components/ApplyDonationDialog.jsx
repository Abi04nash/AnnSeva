import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { Textarea } from './ui/textarea';

const ApplyDonationDialog = ({ donation, onClose, onApplied }) => {
  const [requestedUnits, setRequestedUnits] = useState(1);
  const [requestedItems, setRequestedItems] = useState(donation.items || []);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (requestedUnits < 1) {
      toast.error('Units must be at least 1');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${donation._id}`,
        { requestedUnits, requestedItems },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        onApplied(res.data.donation); 
        onClose(); 
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed px-2 inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{donation.title}</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Requested Units</label>
          <input
            type="number"
            min={1}
            max={donation.quantity}
            value={requestedUnits}
            onChange={(e) => setRequestedUnits(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Choose Items</label>
          <div className="flex flex-wrap gap-2">
            {donation.items.map((item, i) => (
              <Badge
                key={i}
                className={`cursor-pointer ${requestedItems.includes(item) ? 'bg-[#F83002] text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => {
                  if (requestedItems.includes(item)) {
                    setRequestedItems(requestedItems.filter(it => it !== item));
                  } else {
                    setRequestedItems([...requestedItems, item]);
                  }
                }}
              >
                {item}
              </Badge>
            ))}
          </div>
          
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Message for Donor</label>
          <Textarea
            type="string"
            className="w-full border rounded p-2"
          />
        </div>

        

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button
            onClick={handleApply}
            disabled={loading}
            className="bg-[#F83002] hover:bg-[#d82800]"
          >
            {loading ? 'Processing...' : 'Apply'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyDonationDialog;
