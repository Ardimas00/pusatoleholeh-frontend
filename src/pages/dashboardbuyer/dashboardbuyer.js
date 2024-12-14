import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthContext } from '../../components/context/AuthContext';
import axios from 'axios';
import Header from '../../components/section/header';
import Footer from '../../components/section/footer';
import Profile from './profile';
import Address from './address';

const DashboardBuyer = () => {
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [addressData, setAddressData] = useState([]);
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${apiUrl}/user`, { headers });
        
        setUserData(response.data.user);
        setUserImage(response.data.image?.[0]);
        setAddressData(response.data.address || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) fetchData();
  }, [token, apiUrl]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard Buyer</h1>
          
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <NavLink
              to="profile"
              className={({ isActive }) =>
                `px-4 py-2 mr-4 ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`
              }
            >
              Biodata
            </NavLink>
            <NavLink
              to="address"
              className={({ isActive }) =>
                `px-4 py-2 ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`
              }
            >
              Alamat
            </NavLink>
          </div>

          {/* Routes */}
          <Routes>
            <Route 
              path="profile" 
              element={userData && <Profile userData={userData} userImage={userImage} />} 
            />
            <Route 
              path="address" 
              element={<Address addressData={addressData} />} 
            />
            <Route path="/" element={<Navigate to="profile" replace />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardBuyer;
