import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/donationSlice';

const filterData = [
  {
    filterType: "Location",
    key: "location",
    array: ["Bhubaneswar", "Cuttack", "Hyderabad", "Pune", "Bhopal", "Kolkata"]
  },
  {
    filterType: "Category",
    key: "category",
    array: ["Foods", "Groceries", "Snacks", "Fruits", "Vegetables", "Others"]
  }
];

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState({ type: "", value: "" });
  const dispatch = useDispatch();

  const changeHandler = (type, value) => {
    setSelectedFilters({ type, value }); // ✅ only last clicked filter matters
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedFilters));
  }, [selectedFilters, dispatch]);

  return (
    <div className='w-full bg-white p-4 rounded-md shadow-md'>
      <h1 className='font-bold text-lg mb-3 text-amber-600'>Filter Donations</h1>
      <hr className='mb-3' />

      {filterData.map((data, index) => (
        <div key={index} className='mb-4'>
          <h2 className='font-semibold text-md mb-1 text-gray-700'>{data.filterType}</h2>
          <RadioGroup
            value={selectedFilters.type === data.key ? selectedFilters.value : ''}
            onValueChange={(val) => changeHandler(data.key, val)}
          >
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div key={itemId} className='flex items-center space-x-2 my-1'>
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId} className='text-gray-600 cursor-pointer'>{item}</Label>
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



