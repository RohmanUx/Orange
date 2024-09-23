'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // Sesuaikan path sesuai kebutuhan
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Carousel } from '@/components/ui/carousel'; // Import Carousel dari ShadCN UI
import Animation from '../layout/circle';
import CircularText from '../layout/circle';

type Event = {
  ticketType: string;
  location: { id: number; locationName: string };
  category: { id: number; categoryName: string };
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

type Category = {
  id: number;
  categoryName: string;
  event: Event[];
};

type Location = {
  id: number;
  locationName: string;
  event: Event[];
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(12);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/category/categories',
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err: any) {
        console.log('Error fetching categories:', err);
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/location/location',
        );
        setLocations(response.data);
      } catch (err) {
        console.log('Error fetching locations:', err);
        setError('Failed to fetch locations');
        setLoading(false);
      }
    };

    fetchCategories();
    fetchLocations();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setCurrentCategory(categoryId);
    setCurrentLocation(null); // Reset location filter when a category is selected
    setCurrentPage(1);
  };

  const handleLocationClick = (locationId: number) => {
    setCurrentLocation(locationId);
    setCurrentCategory(null); // Reset category filter when a location is selected
    setCurrentPage(1);
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/eventSearch/${eventId}`);
  };

  if (loading)
    return <div className="w-full flex justify-center py-36">Loading ... </div>;
  if (error) return <div>{error}</div>;

  const paginate = (events: Event[]) => {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    return events.slice(indexOfFirstEvent, indexOfFirstEvent + eventsPerPage);
  };

  const totalPages = (events: Event[]) =>
    Math.ceil(events.length / eventsPerPage);

  const allEvents = categories.flatMap((category) => category.event);

  const filteredEvents =
    currentCategory !== null
      ? categories.find((category) => category.id === currentCategory)?.event || []
      : currentLocation !== null
      ? locations.find((location) => location.id === currentLocation)?.event || []
      : allEvents;

   return (
    <div className="flex-1 relative sm:min-h-[1660px] lg:xl:min-h-[1700px]">
      <div className="relative min-h-[1460px] lg:xl:min-h-[1400px]">
        <Image
          src="/105408.gif"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full"
        />
        <div className="relative z-10 flex flex-col items-center pt-4 lg:py-2 bg-gray-100 bg-opacity-60 h-[1460px] sm:h-[1660px] md:h-[1860px] lg:xl:h-[1860px]">
          <div className="p-2 sm:p-4 lg:p-6 xl:px-24 lg:px-10 px-2 sm:px-4">
            <div className="space-y-2 sm:space-y-4">
              <div className="border p-2 sm:p-4 lg:p-4 shadow-lg backdrop-blur-lg justify-center grid border-black/30">
                <div className="flex flex-col items-center pt-10 py-4 px-3 rounded-xl">
                  <h1 className="text-gray-800 text-xl sm:text-2xl lg:text-4xl font-medium text-center flex">
                    Event yours love?
                  </h1>
                </div>
                <div className="mb-4 sm:mb-8 flex flex-nowrap justify-center font-sans rounded-md space-x-1 sm:space-x-2 lg:space-x-4 flex-col items-center ">
                 <div>  {/* Category Filter */}
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full font-semibold transition-transform text-xs lg:text-base transform border-black/60 border-[1px] ${
                          currentCategory === category.id
                            ? 'bg-gray-400/90 text-gray-900 hover:bg-gray-500/90'
                            : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                        } shadow-md`}
                      >
                        {category.categoryName}
                      </Button>
                    ))
                  ) : (
                    <div className="text-sm">No categories available</div>
                  )} </div> 

              <div className='py-2 space-x-2'>    {/* Location Filter */}
                  {locations.length > 0 ? (
                    locations.map((location) => (
                      <Button
                        key={location.id}
                        onClick={() => handleLocationClick(location.id)}
                        className={`px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full font-semibold transition-transform text-xs lg:text-base transform border-black/60 border-[1px] ${
                          currentLocation === location.id
                            ? 'bg-gray-400/90 text-gray-900 hover:bg-gray-500/90'
                            : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                        } shadow-md`}
                      >
                        {location.locationName}
                      </Button>
                    ))
                  ) : (
                    <div className="text-sm">No locations available</div>
                  )} </div>
                </div>

                <div className="space-y-4 sm:md:xl:lg:w-[1100px] mt- grid grid-cols-1 sm:grid-cols-4 gap-4 mx-3">
                  {filteredEvents.length > 0 ? (
                    paginate(filteredEvents).map((event) => {
                      const currentTime = new Date().getTime();
                      const startTime = new Date(event.startTime).getTime();
                      const endTime = new Date(event.endTime).getTime();
                      const isOngoing =
                        currentTime > startTime && currentTime < endTime;
                      const isEnded = currentTime > endTime;

                      return (
                        <div className="grid grid-cols-1 mt-4 p-0 mx-3 ">
                          <div
                            key={event.id}
                            className="p-2 sm:p-4 lg:p-4 rounded-none flex flex-col items-center py-4 font-sans shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-orange-50/40 border-[1px] border-black/60"
                            onClick={() => handleEventClick(event.id)}
                          >
                            <h1 className="text-sm sm:text-base lg:text-lg font-sans mb-2 text-center">
                              {event.title}
                            </h1>
                            <div className="h-32 sm:h-48 w-full flex justify-center">
                              {event.images.length > 0 && (
                                <Image
                                  src={`http://localhost:8000${event.images[0].path}`}
                                  alt={event.title}
                                  height={120}
                                  width={200}
                                  className="rounded-sm"
                                />
                              )}
                            </div>
                            <p className="text-gray-700 font-sans my-2 lg:my-4 line-clamp-3 sm:px-28 px-4 text-center text-xs sm:text-sm">
                              {event.description}
                            </p>

                            <div className="text-gray-600 font-sans bg-gray-300 flex rounded-full pl-2 my-1 text-xs lg:text-sm">
                              Location
                              <span className="bg-gray-600 flex rounded-full font-sans ml-1 px-2 text-xs text-gray-100">
                                {event.location.locationName}
                              </span>
                            </div>
                            <div
                              className={`text-${
                                isEnded ? 'red' : isOngoing ? 'green' : 'gray'
                              }-700 font-sans bg-gray-300 rounded-full pl-2 flex text-xs lg:text-sm my-1`}
                            >
                              Status
                              <span className="bg-gray-600 flex rounded-full ml-1 font-sans px-2 text-xs text-gray-100">
                                {isEnded
                                  ? 'Ended'
                                  : isOngoing
                                    ? 'Ongoing'
                                    : 'Upcoming'}
                              </span>
                            </div>
                            <div className="text-gray-600 font-sans bg-gray-300 flex rounded-full pl-2 my-1 text-xs lg:text-sm ">
                              Ticket
                              <span className="bg-gray-600 flex rounded-full font-sans ml-1 px-2 text-xs text-gray-100">
                                {event.ticketType}
                              </span>
                            </div>
                            <div className="text-gray-600 font-sans bg-gray-300 rounded-full pl-2 flex my-1 text-xs lg:text-sm">
                              Seats
                              <span className="text-gray-100 text-xs font-sans bg-gray-600 rounded-full px-2">
                                {event.totalSeats}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="justify-center flex pb-4 text-xs lg:text-sm">
                      No events available
                    </p>
                  )}
                </div> </div> </div>
                {filteredEvents.length > eventsPerPage && (
                  <div className="flex justify-center mt-3 text-xs lg:text-sm items-center px-0 pb-10 space-x-1">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="bg-gray-900/60 text-gray-100 px-4 py-0 rounded-full hover:bg-gray-700 backdrop-blur-3xl"
                    >
                      &lt; 

                    </Button>
                    <span className="p-1 bg-gray-900/60 text-gray-100 rounded-full px-2 h-10 flex items-center backdrop-blur-3xl">
                      {currentPage} {' '}
                   
                    </span>
                    <Button
                      disabled={currentPage === totalPages(filteredEvents)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="bg-gray-900/60 text-gray-100 px-4 py-0 rounded-full hover:bg-gray-700 backdrop-blur-3xl"
                    >
                      &gt;
 
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      
    
  );
};

export default CategoryList;
