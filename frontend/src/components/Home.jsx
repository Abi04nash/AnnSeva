import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import LatestDonations from './LatestDonations';
import Footer from './shared/Footer';
import useGetAllDonations from '@/hooks/useGetAllDonations';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  useGetAllDonations();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'donor') {
      navigate('/admin/donors');
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <LatestDonations />
      <Footer />
    </div>
  );
};

export default Home;


