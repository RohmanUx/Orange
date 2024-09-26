'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { headers } from 'next/headers';

type Event = {
  ticketType: string;
  location: { id: number; locationName: string };
  id: number;
  title: string;
  description: string;
  totalSeats: number;
  images: { id: number; path: string; eventId: number }[];
  price: number;
  startTime: string;
  endTime: string;
  isDeleted: boolean;
};

const EventList: React.FC = () => {
  const [events, setEvents] = useState({
    ticketType: '',
    location: { id: 0, locationName: '' },
    id: 0,
    title: '',
    description: '',
    totalSeats: 0,
    images: { id: '', path: '', eventId: '' },
    price: 0,
    startTime: '',
    endTime: '',
    isDeleted: false,
  });

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/event/events-user',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          },
        ); 
        console.log(response, 'hallo');
        setEvents(response.data.data);
        if (response.data.data) {
          console.log('succes there data');
          return true;
        }

        // setTotalPages(response.data.pagination.totalPages);
        setHide(true);
      } catch (error) {
        console.log('Error fetching events', error);
      }
    };

    fetchEvents();
  }, [page]);

  const handleDelete = async (eventId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/event/events/`, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data',

        },
      }); 
      //  setEvents(event.filter((event) => event.id !== eventId));
    } catch (error) {
      console.log('Error deleting event', error);
      toast.error('do You not have permition within owner event can delete', {
        className: 'bg-red-100 text-red-700 p-4 rounded-lg',
        bodyClassName: 'font-medium',
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="bg-purple-50 h-screen">
        <div className="p-7 max-w-6xl mx-auto bg-purple-50 h-screen flex-col justify-between flex">
          <div>
            <h1 className="text-3xl font-medium text-gray-800 mb-5 text-center pt-10">
              Your event
            </h1>
            <div className="flex mb-8 justify-center rounded-full">
              <Link href="/dashboard/create">
                <div className="text-gray-900 px-6 py-2 hover:bg-blue-100 transition duration-300 font-sans rounded-full border-[1px] border-black">
                  Create Update event +
                </div>
              </Link>
            </div>{' '}
          </div>

          {events && events.id ? (
  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <li
      key={events.id}
      className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out border-black border-[1px]"
    >
      <div className="relative">
        <Image
          src={``}
          alt={events.title}
          height={200}
          width={400}
          className="object-cover w-full h-48 p-4"
        />
      </div>
      <div className="p-4">
        <div className="mb-4 h-32">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {events.title}
          </h2>
          <p className="text-gray-600 line-clamp-3">
            {events.description}
          </p>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center mb-1">
            <span className="font-medium">Location:</span>
            <span className="ml-2">{events.location.locationName}</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="font-medium">Ticket:</span>
            <span className="ml-2">{events.ticketType}</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="font-medium">Seats:</span>
            <span className="ml-2">{events.totalSeats}</span>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            onClick={() => handleDelete(events.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  </ul>
) : (
  <p className="text-center text-gray-500">No events available.</p>
)}

          <div className="mt-8 flex justify-between items-end">
            <button
              className="bg-gray-0 text-gray-900 px-4 py-2 hover:bg-gray-900 transition duration-300 disabled:opacity-50 rounded-full border border-black"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="p-1 bg-gray-0 text-gray-900 rounded-full px-4 h-8 flex items-end border-[1px] border-black">
              {page} page of {totalPages}
            </span>

            <button
              className="bg-gray-0 text-gray-900 px-4 py-2 hover:bg-gray-900 transition duration-300 disabled:opacity-50 rounded-full border border-black"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
        <div className="h-screen bg-purple-50">
          <h1 className="text-3xl font-medium text-gray-800 mb-5 text-center pt-40">
            Event static
          </h1>{' '}
        </div>
      </div>{' '}
    </div>
  );
};

export default EventList;
