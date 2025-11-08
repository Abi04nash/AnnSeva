import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/donationSlice';
import { useNavigate } from 'react-router-dom';
import CategoryCarousel from './CategoryCarousel';


const HeroSection = () => {

  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchDonationHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <div
      className="hero relative h-screen flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1920')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-7 lg:gap-5 my-10 text-white items-center">
        <h1 className="text-[29px] lg:text-5xl font-bold leading-[1.4] lg:leading-[1.4]">
          Turning <span className="text-yellow-400">Surplus</span> into{' '}
          <span className="text-yellow-400">Smiles</span>
          <br />
          <span className="text-[#F83002]">
            One Click at a Time{' '}
            <span className="text-pink-400">
              <i className="fa-solid fa-heart-circle-check"></i>
            </span>
          </span>
        </h1>

        <p className="font-medium leading-loose text-md lg:text-xl w-full sm:w-4/5 md:w-[60%] text-center mx-auto">
          At <span className="font-bold text-amber-400">AnnSeva</span>, we connect generous donors with
          local NGOs and Food Banks. Together, we can build a compassionate community where
          no meal goes to waste and no one stays hungry.
        </p>

        <div className="flex w-full sm:w-3/5 md:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto bg-white">
          <input
            type="text"
            placeholder="Find Donations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full text-black px-3 py-2 rounded-l-full"
          />
          <Button
            onClick={searchDonationHandler}
            className="w-13 rounded-r-full bg-[#F83002] hover:bg-[#d92200]"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Food Category Carousel */}
      <div className="w-full flex justify-center mt-8">
        <CategoryCarousel />
      </div>
    </div>
  );
};

export default HeroSection;

