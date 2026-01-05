import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/donationSlice';
import { useNavigate } from 'react-router-dom';
import CategoryCarousel from './CategoryCarousel';
import { motion } from 'framer-motion'; 

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchDonationHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center">


      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1920')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80 z-0"></div>


      <div className="relative mb-28 md:mb-0 lg:mb-0 z-10 w-full max-w-7xl mx-auto px-2 flex flex-col items-center gap-9">


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >


          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Turning <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">Surplus</span> into
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">Smiles</span>
          </h1>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 text-3xl md:text-5xl font-light text-white italic"
          >
            One Click at a Time
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
        >
          At <span className="font-bold text-yellow-500">Ann</span><span className='font-bold text-orange-500'>Seva</span>, we bridge the gap between generosity and hunger.
          Connect with local NGOs to ensure no meal goes to waste.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-xl relative group"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-orange-600 to-yellow-600 rounded-full blur opacity-25 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex w-full p-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl">
            <input
              type="text"
              placeholder="Search for donations, food banks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-gray-300 px-6 outline-none border-none text-lg rounded-full"
            />
            <Button
              onClick={searchDonationHandler}
              className="rounded-full h-10 w-12 m-1 md:w-auto md:px-8 bg-[#F83002] hover:bg-[#d92200] text-white border-none transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
            >
              <Search className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline font-semibold">Search</span>
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-10 w-full z-20 px-4"
      >
        <div className="max-w-7xl mx-auto">

        </div>
      </motion.div>

    </div>
  );
};




export default HeroSection;