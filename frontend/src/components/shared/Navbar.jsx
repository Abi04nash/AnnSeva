import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { clearDonorState } from '@/redux/donorSlice';
import { clearDonationState } from '@/redux/donationSlice';

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(clearDonorState());
        dispatch(clearDonationState());
        toast.success(res.data.message);
        navigate('/');
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
      toast.error('Logged Out');
    }
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `relative font-medium text-sm transition-all duration-300 ${
      isActive ? 'text-[#F83002] font-semibold' : 'text-gray-600 hover:text-[#F83002]'
    }`;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-13 lg:16">
          
          {/* ✅ LEFT SECTION: Logo (flex-1 forces it to take equal space as right section) */}
          <div className="flex-1 flex justify-start">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-1">
                <span className="text-amber-500">Ann</span>
                <span className="text-[#F83002]">Seva</span>
              </h1>
            </div>
          </div>

          {/* ✅ MIDDLE SECTION: Navigation Links (Always perfectly centered now) */}
          <ul className="hidden md:flex items-center justify-center gap-8">
            {user && user.role === 'donor' ? (
              <>
                <li>
                  <Link to="/admin/donors" className={getLinkClasses('/admin/donors')}>
                    <i className="fa-solid fa-bowl-rice mr-2"></i>Sources
                  </Link>
                </li>
                <li>
                  <Link to="/admin/donations" className={getLinkClasses('/admin/donations')}>
                    <i className="fa-solid fa-globe mr-2"></i>Donations
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className={getLinkClasses('/')}>
                    <i className="fa-solid fa-house mr-2"></i>Home
                  </Link>
                </li>
                <li>
                  <Link to="/donations" className={getLinkClasses('/donations')}>
                    <i className="fa-solid fa-bowl-rice mr-2"></i>Donations
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className={getLinkClasses('/browse')}>
                    <i className="fa-brands fa-safari mr-2"></i>Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* ✅ RIGHT SECTION: Auth/Profile (flex-1 forces it to take equal space as left section) */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-6 font-semibold border-gray-300 hover:bg-gray-50 transition-colors">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full px-6 font-semibold bg-[#F83002] hover:bg-[#d82800] text-white shadow-md hover:shadow-lg transition-all">
                    SignUp
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer h-10 w-10 border-2 border-orange-200 hover:border-[#F83002] transition-colors shadow-sm">
                    {!user?.profile?.profilePhoto ? (
                      <AvatarImage src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />
                    ) : (
                      <AvatarImage src={user?.profile?.profilePhoto} alt="@user" className="object-cover" />
                    )}
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 mt-2 mr-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <Avatar className="h-12 w-12 border border-gray-100 shadow-sm">
                      {!user?.profile?.profilePhoto ? (
                        <AvatarImage src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />
                      ) : (
                        <AvatarImage src={user?.profile?.profilePhoto} alt="@user" className="object-cover" />
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-gray-900 leading-tight">{user?.fullname}</h4>
                      <p className="text-xs text-gray-500 font-medium line-clamp-1">{user?.profile?.about || user?.role?.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col mt-3 space-y-1">
                    {user && user.role === 'ngo' && (
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-[#F83002] transition-colors font-medium">
                        <User2 className="w-5 h-5" />
                        <span>View Profile</span>
                      </Link>
                    )}

                    {user && user.role === 'donor' && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-[#F83002] transition-colors font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    
                    <button onClick={logoutHandler} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors font-medium w-full text-left">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0">
          <ul className="flex flex-col px-6 py-4 space-y-4">
            {user && user.role === 'donor' ? (
              <>
                <li>
                  <Link to="/admin/donors" className={`flex items-center ${getLinkClasses('/admin/donors')}`} onClick={() => setMobileMenuOpen(false)}>
                    <i className="fa-solid fa-bowl-rice w-6 text-center mr-2"></i>Sources
                  </Link>
                </li>
                <li>
                  <Link to="/admin/donations" className={`flex items-center ${getLinkClasses('/admin/donations')}`} onClick={() => setMobileMenuOpen(false)}>
                    <i className="fa-solid fa-globe w-6 text-center mr-2"></i>Donations
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className={`flex items-center ${getLinkClasses('/')}`} onClick={() => setMobileMenuOpen(false)}>
                    <i className="fa-solid fa-house w-6 text-center mr-2"></i>Home
                  </Link>
                </li>
                <li>
                  <Link to="/donations" className={`flex items-center ${getLinkClasses('/donations')}`} onClick={() => setMobileMenuOpen(false)}>
                    <i className="fa-solid fa-bowl-rice w-6 text-center mr-2"></i>Donations
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className={`flex items-center ${getLinkClasses('/browse')}`} onClick={() => setMobileMenuOpen(false)}>
                    <i className="fa-brands fa-safari w-6 text-center mr-2"></i>Browse
                  </Link>
                </li>
              </>
            )}

            {!user && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl font-semibold border-gray-300">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl font-semibold bg-[#F83002] hover:bg-[#d82800] text-white shadow-md">SignUp</Button>
                </Link>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;