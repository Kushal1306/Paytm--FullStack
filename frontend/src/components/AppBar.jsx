import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, IndianRupee, Menu } from 'lucide-react'

const AppBar = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const getDetails = async () => {
      try {
        const response = await axios.get("https://paytm-full-stack.vercel.app/api/user/getUser", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
      } catch (error) {
        console.error(error);
      }
    }
    getDetails();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <IndianRupee size={24} />
            <span className="text-xl font-bold">PaytmApp</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm">
              Hello, <span className="font-semibold">{firstName} {lastName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition duration-300 ease-in-out flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 py-2">
          <div className="container mx-auto px-4">
            <div className="text-sm mb-2">
              Hello, <span className="font-semibold">{firstName} {lastName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition duration-300 ease-in-out flex items-center justify-center"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppBar