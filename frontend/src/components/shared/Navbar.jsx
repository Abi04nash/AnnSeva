import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { clearDonorState } from '@/redux/donorSlice';
import { clearDonationState } from '@/redux/donationSlice';
// import { clearUserState } from "@/redux/userSlice";

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

 

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl ">
        <div className="nav p-1 flex justify-between h-13 items-center">
        
          <div className="w-[15%]  shrink-0">
            <h1 className=" text-transparent bg-clip-text tracking-tight text-lg sm:text-3xl font-bold flex items-center gap-1">
              <span className="text-yellow-400">Ann</span>
              <span className="text-[#F83002]">Seva</span>
            </h1>
          </div>

          
          <ul className="hidden w-[30%]  md:flex font-medium justify-center items-center gap-6">
            {user && user.role === 'donor' ? (
              <>
                <li>
                  <Link
                    to="/admin/donors"
                    className={location.pathname === '/admin/donors' ? 'text-[#F83002]' : ''}
                  >
                    <i class="fa-solid fa-bowl-rice"></i>Sources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/donations"
                    className={location.pathname === '/admin/donations' ? 'text-[#F83002]' : ''}
                  >
                    <i className="fa-solid fa-globe"></i>Donations
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={location.pathname === '/' ? 'text-[#F83002]' : ''}
                  >
                    <i className="fa-solid fa-house"></i>Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/donations"
                    className={location.pathname === '/donations' ? 'text-[#F83002]' : ''}
                  >
                    <i class="fa-solid fa-bowl-rice"></i>Donations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className={location.pathname === '/browse' ? 'text-[#F83002]' : ''}
                  >
                    <i class="fa-brands fa-safari"></i>Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right section */}
          <div className="flex w-[15%] justify-end gap-2 md:gap-4">
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#F83002] hover:bg-orange-800">SignUp</Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer h-6 w-6 border-2 border-orange-200 md:h-8 md:w-8">
                    {!user?.profile?.profilePhoto ?(<AvatarImage src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />):( <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" /> )}
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div>
                    <div className="flex gap-2 space-y-2">
                      <Avatar className="cursor-pointer">
                        {!user?.profile?.profilePhoto ?(<AvatarImage src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />):( <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" /> )}
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user?.fullname}</h4>
                        <p className="text-sm text-muted-foreground">{user?.profile?.about}</p>
                      </div>
                    </div>
                    <div className="flex flex-col my-2 px-1 text-gray-600">
                      {user && user.role === 'ngo' && (
                        <div className="mb-1 flex w-fit items-center gap-2 cursor-pointer">
                          <User2 />
                          <Button className="bg-orange-50 hover:bg-orange-100" variant="link">
                            <Link to="/profile">View Profile</Link>
                          </Button>
                        </div>
                      )}

                      {user && user.role === 'donor' && (
                        <div className="mb-1 flex w-fit items-center gap-2 cursor-pointer">
                          <User2 />
                          <Button className="bg-orange-50 hover:bg-orange-100" variant="link">
                            <Link to="/admin/dashboard">Dashboard</Link>
                          </Button>
                        </div>
                      )}
                      <div className="mb-1 flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button className="bg-orange-50 hover:bg-orange-100" onClick={logoutHandler} variant="link">
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

          
            <button
              className="md:hidden flex items-center p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

   
      {mobileMenuOpen && (
        <div className=" md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md">
          <ul className="mod flex flex-col gap-3 font-medium">
            {user && user.role === 'donor' ? (
              <>
                <li>
                  <Link
                    to="/admin/donors"
                    className={location.pathname === '/admin/donors' ? 'text-[#F83002]' : ''}
                  >
                    <i class="fa-solid fa-bowl-rice"></i>Sources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/donations"
                    className={location.pathname === '/admin/donations' ? 'text-[#F83002]' : ''}
                  >
                    <i className="fa-solid fa-globe"></i>Donations
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={location.pathname === '/' ? 'text-[#F83002]' : ''}
                  >
                    <i className="fa-solid fa-house"></i>Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/donations"
                    className={location.pathname === '/donations' ? 'text-[#F83002]' : ''}
                  >
                    <i class="fa-solid fa-bowl-rice"></i>Donations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className={location.pathname === '/browse' ? 'text-[#F83002]' : ''}
                  >
                    <i class="fa-brands fa-safari"></i>Browse
                  </Link>
                </li>
              </>
            )}

            {!user && (
              <>
                <li>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/signup">
                    <Button className="bg-[#F83002] hover:bg-orange-800 w-full">SignUp</Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
