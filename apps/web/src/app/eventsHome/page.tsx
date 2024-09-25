'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // Sesuaikan path sesuai kebutuhan
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Carousel } from '@/components/ui/carousel'; // Import Carousel dari ShadCN UI
import Animation from '../layout/circle';
import CircularText from '../layout/circle';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
      ? categories.find((category) => category.id === currentCategory)?.event ||
        []
      : currentLocation !== null
        ? locations.find((location) => location.id === currentLocation)
            ?.event || []
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
          <div className="p-2 sm:p-4  xl:px-24 lg:px-10 px-2 sm:px-4">
            <div>
              <div className="p-2 sm:p-4 lg:p-4 backdrop-blur-none justify-center h-[1300px] sm:h-[1660px] md:h-[1860px] lg:xl:h-[1800px] ">
                <div className="flex flex-col items-center pt-10 py-4 px-3 rounded-xl">
                  <h1 className="text-gray-800 text-xl sm:text-2xl lg:text-4xl font-medium text-center flex">
                    Event yours love?
                  </h1>
                </div>
                <div className="mb-4 sm:mb-8 flex flex-nowrap justify-center font-sans rounded-md space-x-1 sm:space-x-2 lg:space-x-4 flex-col items-center ">
                  <div className="py-1 space-x-2">
                    {' '}
                    {/* Category Filter */}
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className={`px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full font-semibold transition-transform font-sans text-xs lg:text-base transform border-black/60 border-[1px] ${
                            currentCategory === category.id
                              ? 'bg-orange-400/90 text-gray-900 hover:bg-gray-500/90'
                              : 'bg-orange-300 text-gray-900 hover:bg-gray-400'
                          } shadow-md`}
                        >
                          {category.categoryName}
                        </Button>
                      ))
                    ) : (
                      <div className="text-sm text-gray-900">
                        No categories available{' '}
                      </div>
                    )}{' '}
                  </div>

                  <div className="py-1 space-x-2">
                    {' '}
                    {/* Location Filter */}
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <Button
                          key={location.id}
                          onClick={() => handleLocationClick(location.id)}
                          className={`px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full font-semibold transition-transform text-xs font-sans lg:text-base transform border-black/60 border-[1px] ${
                            currentLocation === location.id
                              ? 'bg-gray-400/90 text-gray-900 hover:bg-gray-500/90'
                              : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                          } shadow-md`}
                        >
                          {location.locationName}
                        </Button>
                      ))
                    ) : (
                      <div className="text-sm">No locations available </div>
                    )}{' '}
                  </div>
                </div>

                <div className="space-y-2 sm:md:xl:lg:w-[1200px] mt- grid grid-cols-1 sm:grid-cols-4 gap-4 mx-0">
                  {filteredEvents.length > 0 ? (
                    paginate(filteredEvents).map((event) => {
                      const currentTime = new Date().getTime();
                      const startTime = new Date(event.startTime).getTime();
                      const endTime = new Date(event.endTime).getTime();
                      const isOngoing =
                        currentTime > startTime && currentTime < endTime;
                      const isEnded = currentTime > endTime;

                      return (
                        <div className="grid grid-cols-1 mt-2 p-0 mx-0 ">
                          <div
                            key={event.id}
                            className="p-2 sm:p-4 lg:p-4 rounded-none flex flex-col items-center py-4 font-sans shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-orange-50/40 border-[1px] border-black/60"
                            onClick={() => handleEventClick(event.id)}
                          >
                            <h1 className="text-sm sm:text-base lg:text-lg font-sans mb-2 text-center text-gray-900">
                              {event.title}
                            </h1>
                            <div className="h-32 sm:h-48 w-full flex justify-center">
                              {event.images.length > 0 && (
                                <Swiper
                                  spaceBetween={10}
                                  slidesPerView={1}
                                  loop={true}
                                  className="rounded-sm"
                                >
                                  {event.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                      <Image
                                        src={`http://localhost:8000${image.path}`}
                                        alt={event.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="absolute inset-0 w-full h-full"
                                      />
                                    </SwiperSlide>
                                  ))}
                                </Swiper>
                              )}
                            </div>

                            <p className="text-gray-800 font-sans my-2 lg:my-4 line-clamp-3 sm:px-0 px-0 text-center text-sm sm:text-base">
                              {event.description}
                            </p>

                            <div className="flex flex-wrap">
                              <div className="text-gray-600 font-sans bg-gray-100 flex rounded-full pl-3 py-0 text-sm lg:text-base items-center text-center">
                                location:
                                <span className="text-gray-600 font-sans bg-gray-0 flex rounded-full px-1 mr-1 py-0">
                                  {event.location.locationName}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`text-${
                                isEnded ? 'red' : isOngoing ? 'green' : 'gray'
                              }-600 font-sans bg-gray-100 rounded-full pl-3 flex text-sm lg:text-base my-2`}
                            >
                              status:
                              <span className="text-gray-600 font-sans bg-gray-0 flex rounded-full px-1 mr-1 py-0">
                                {isEnded
                                  ? 'Ended'
                                  : isOngoing
                                    ? 'Ongoing'
                                    : 'Upcoming'}
                              </span>
                            </div>

                            <div className="text-gray-600 font-sans bg-gray-100 flex rounded-full pl-3 my-0 text-sm lg:text-base">
                              ticket:
                              <span className="text-gray-600 font-sans bg-gray-0 flex rounded-full px-1 mr-1 py-0">
                                {event.ticketType}
                              </span>
                            </div>

                            <div className="text-gray-600 font-sans bg-gray-100 rounded-full pl-3 flex my-2 text-sm lg:text-base">
                              seats:
                              <span className="text-gray-600 font-sans bg-gray-0 flex rounded-full px-1 mr-1 py-0">
                                {event.totalSeats}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="justify-center flex pb-4 text-xs lg:text-sm w-full items-center">
                      No events available
                    </p>
                  )}
                </div>
                {filteredEvents.length > eventsPerPage && (
                  <div className="flex justify-center mt-4 text-sm lg:text-base items-center space-x-2">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className={`${
                        currentPage === 1
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-600'
                      } text-white px-4 py-2 rounded-full transition-all duration-200 ease-in-out flex items-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </Button>

                    <span className="p-2 bg-gray-900/80 text-white rounded-full px-4 h-8 flex items-center backdrop-blur-md shadow-md">
                      Page {currentPage} of {totalPages(filteredEvents)}
                    </span>

                    <Button
                      disabled={currentPage === totalPages(filteredEvents)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className={`${
                        currentPage === totalPages(filteredEvents)
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-gray-700 hover:bg-gray-600'
                      } text-white px-4 py-2 rounded-full transition-all duration-200 ease-in-out flex items-center`}
                    >
                      Next
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>{' '}
            </div>{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
