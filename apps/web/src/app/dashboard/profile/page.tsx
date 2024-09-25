'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ( ) => {
  const [profile, setProfile] = useState({
    address: '',
    image: '',
    dateOfBirth: '',
    firstName: '',
    lastName: '',
    gender: '',
    location: '',
    phoneNumber: '',
  });
  const [get, setGet] = useState({
    address: '',
    image: '',
    dateOfBirth: '',
    firstName: '',
    lastName: '',
    gender: '',
    location: { locationName: '' },
    phoneNumber: '',
  });
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProfilePosted, setIsProfilePosted] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setComment('Authentication token missing. Please log in.');
      setLoading(false);
      return;
    }
    try {
      const data = await axios.get('http://localhost:8000/api/user/profile/', {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.data.result.length > 0) {
        setGet(data.data.result[0]);
        setProfile(data.data.result[0]);
        setIsProfilePosted(true); // Set to true if profile exists
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // menanangani pristiwa perubahan html
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Submit Profile Update
  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setComment('Authentication token missing. Please log in.');
      return;
    }

    e.preventDefault();
    try {
      if (isProfilePosted) {
        // Update existing profile
        await axios.patch('http://localhost:8000/api/user/profile/', profile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Profile updated successfully');
      } else {
        // Create new profile
        await axios.post('http://localhost:8000/api/user/profile/', profile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Profile created successfully');
        setIsProfilePosted(true); // Update state after successful post
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="h-[1500px] bg-black bg-opacity-50 backdrop-blur-lg mt-14">
      <div className="flex justify-center flex-wrap border-b-2">
        <h1 className="text-3xl font-medium mb-0 text-gray-900 text-center font-sans w-full pt-24">
          Your account
        </h1>
        <div className="space-x-4 h-screen flex justify-center py-10">
          <div className="p-6 rounded-lg max-w-md bg-white bg-opacity-10 backdrop-blur-md h-[460px] w-[900px]">
            <div className="profile-container">
              {comment && <p>{comment}</p>}
              <div className="h-60 border-2 border-black mb-4">
                {get.image && <img src={get.image} alt="Profile" />}
              </div>
              <h1>
                Name: {get.firstName} {get.lastName}
              </h1>
              <p>Gender: {get.gender}</p>
              <p>Address: {get.address}</p>
              <p>Phone: {get.phoneNumber}</p>
              <p>
                Date of Birth: {new Date(get.dateOfBirth).toLocaleDateString()}
              </p>
              <p>Location: {get.location.locationName}</p>
            </div>
          </div>
          <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg shadow-md h-[460px]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
              />

              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
              />

              <input
                type="text"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
              />

              <label className="block text-white">Gender</label>
              <input
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
              />

              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white focus:ring-2 focus:ring-yellow-400"
              />

              <button
                type="submit"
                className="w-full px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
              >
                {isProfilePosted ? 'Update Profile' : 'Post Profile'}
              </button>
            </form>
          </div>
        </div>{' '}
      </div>
      <div className="flex items-center flex-col h-[700px]">
        <div className="py-40">
          <h1 className="text-3xl sm:text-3xl md:text-3xl font-medium mb-8 text-gray-900 text-center font-sans">
            Free test account
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-4xl px-4">
            {/* Admin Credentials */}
            <div className="p-6 bg-white bg-opacity-10 backdrop-blur-md  border-black border-[1px]">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4 text-center">
                Admin
              </h2>
              <div className="text-lg sm:text-xl">
                <p className="text-gray-200">
                  <strong>Email:</strong> rohman@gmail.com
                </p>
                <p className="text-gray-200">
                  <strong>Password:</strong> AlphaThap42@
                </p>
              </div>
            </div>

            {/* User Credentials */}
            <div className="p-6 bg-white bg-opacity-10 backdrop-blur-md  border-black border-[1px]">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4 text-center">
                User
              </h2>
              <div className="text-lg sm:text-xl">
                <p className="text-gray-200">
                  <strong>Email:</strong> user@gmail.com
                </p>
                <p className="text-gray-200">
                  <strong>Password:</strong> AlphaThap42@
                </p>
              </div>
            </div>
          </div>{' '}
        </div>{' '}
      </div>
    </div>
  );
};

export default Profile;
