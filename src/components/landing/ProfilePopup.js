import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import toast from 'react-hot-toast';

const ProfilePopup = ({ onUpdateAddress, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    province: "",
    city: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${apiUrl}/user/address`, formData, { headers });
      
      toast.success('Address successfully saved!');
      onUpdateAddress(response.data.address);
      setStep(4); // Langsung ke halaman selesai
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      handleNext();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      await axios.post(`${apiUrl}/user/image`, formData, { headers });
      toast.success('Profile picture uploaded successfully!');
      handleNext();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB dalam bytes
        toast.error('Image size must be less than 3MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image size must be less than 3MB');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNext = () => setStep(step + 1);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Complete your profile!</h2>
            <p className="mb-6 text-center text-gray-600">Please complete your account information to access the website!</p>
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-colors"
            >
              Okay
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Wanna add profile picture?</h2>
            <p className="mb-6 text-center text-gray-600">You can upload your profile picture here or add it later.</p>
            <div 
              className="border-dashed border-2 border-gray-300 p-6 mb-4 text-center cursor-pointer rounded-lg"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {selectedImage ? (
                <p className="text-gray-700">{selectedImage.name}</p>
              ) : (
                <>
                  <p className="text-gray-700">Drag and drop or select image to upload</p>
                  <p className="text-sm text-gray-500">( Maximum 3mb. )</p>
                </>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleNext}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors w-1/2"
              >
                Skip
              </button>
              <button
                onClick={handleImageUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-1/2"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <form onSubmit={handleAddressSubmit}>
            <h2 className="text-2xl font-semibold mb-4 text-center">Tell us about your address</h2>
            <p className="mb-6 text-center text-gray-600">Please complete your address information to access the website.</p>
            {["name", "province", "city", "district", "subdistrict", "postalCode"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-2 capitalize text-gray-700">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-colors"
            >
              Save Address
            </button>
          </form>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Profile setup completed!</h2>
            <p className="mb-6 text-center text-gray-600">You can now browse the website and shop freely.</p>
            <div className="flex justify-center mb-6">
              <span className="text-4xl text-green-500">✔️</span>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-colors"
            >
              Let's Go
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
