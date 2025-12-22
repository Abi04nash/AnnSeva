import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import Donation from './Donation';

const SavedDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const res = await axios.get(
        `${USER_API_END_POINT}/saved-donations`,
        { withCredentials: true }
      );
      setDonations(res.data.savedDonations || []);
    };
    fetchSaved();
  }, []);

  return (
    <div className="h-[500px] overflow-y-auto pr-2">
      <h1 className="font-bold text-lg mb-3 text-center">
        Saved <span className="text-[#F83002]">Donations</span>
      </h1>

      {donations.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          No saved donations
        </p>
      ) : (
        donations.map(donation => (
          <Donation key={donation._id} donation={donation} />
        ))
      )}
    </div>
  );
};

export default SavedDonations;
