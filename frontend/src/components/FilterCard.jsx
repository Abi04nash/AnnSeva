import React, { useEffect, useState, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/donationSlice';
import { Filter } from 'lucide-react'; // UI ke liye icon

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState({ type: "", value: "" });
  const dispatch = useDispatch();

  const { allDonations } = useSelector(store => store.donation);

  // Dynamic unique cities logic
  const dynamicLocations = useMemo(() => {
    if (!allDonations) return [];
    
    const cities = allDonations.map(donation => {
      const parts = donation?.pickupLocation?.split(',') || [];
      return parts[parts.length - 1]?.trim();
    }).filter(city => city); 

    const uniqueCities = [...new Set(cities)];
    return uniqueCities.slice(0, 6); 
  }, [allDonations]);

  const filterData = [
    {
      filterType: "Location",
      key: "location",
      array: dynamicLocations.length > 0 ? dynamicLocations : ["Bhubaneswar"] 
    },
    {
      filterType: "Category",
      key: "category",
      array: ["Foods", "Groceries", "Snacks", "Fruits", "Vegetables", "Others"]
    }
  ];

  const changeHandler = (type, value) => {
    setSelectedFilters({ type, value }); 
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  return (
    <div className='w-full bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transition-all'>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#F83002]" />
        <h1 className='font-bold text-xl text-gray-900'>Filter Donations</h1>
      </div>
      
      <hr className='mb-6 border-gray-100' />

      {filterData.map((data, index) => (
        <div key={index} className='mb-6 last:mb-0'>
          <h2 className='font-semibold text-xs uppercase tracking-widest text-gray-500 mb-3'>{data.filterType}</h2>
          <RadioGroup
            value={selectedFilters.type === data.key ? selectedFilters.value : ''}
            onValueChange={(val) => changeHandler(data.key, val)}
            className="space-y-1"
          >
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div key={itemId} className='flex items-center space-x-3 p-2 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer group'>
                  <RadioGroupItem value={item} id={itemId} className="border-gray-300 text-[#F83002] focus:ring-[#F83002]" />
                  <Label htmlFor={itemId} className='text-gray-700 font-medium cursor-pointer capitalize group-hover:text-[#F83002] transition-colors w-full'>
                    {item}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;