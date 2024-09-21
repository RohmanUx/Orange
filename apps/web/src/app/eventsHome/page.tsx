 'use client'
import React, { useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button'; // Adjust path as necessary
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Animation from '../layout/circle';
import CircularText from '../layout/circle';

type Event = {
  ticketType: ReactNode;
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
 } ;

type Category = {
  id: number;
  categoryName: string;
  event: Event[];
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(3);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
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

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
  };

  const handleEventClick = (eventId: number) => {
    router.push(`eventSearch/${eventId}`);
  };

  if (loading) return <div>Loading ... </div>;
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
      : allEvents;

  return (
    <div className="bg-gray-100 flex-1 relative sm:min-h-[1660px] lg:xl:min-h-[1700px]">
  <div className="relative min-h-[1460px] lg:xl:min-h-[1400px]">
    <Image
      src="/105408.gif"
      alt="Hero"
      layout="fill"
      objectFit="cover"
      className="absolute inset-0 w-full h-full"
    />
    <div className="relative z-10 flex flex-col items-center pt-4 lg:py-8 bg-gray-100 bg-opacity-60 h-[1460px] sm:h-[1660px] md:h-[1860px] lg:xl:h-[1860px]">
      <div className="flex flex-col items-center pt-10 pb-5 px-3 rounded-xl">
        <h1 className="text-gray-900 text-xl sm:text-2xl lg:text-4xl font-medium text-center font-new-amsterdam flex">
          Event yours love#
        </h1>
      </div> 
                                     <div className="p-2 sm:p-4 lg:p-6 xl:px-28 lg:px-10 px-2 sm:px-4">
        <div className="mb-4 sm:mb-8 flex flex-wrap justify-center font-sans rounded-md space-x-1 sm:space-x-2 lg:space-x-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full font-semibold transition-transform text-xs lg:text-base transform ${
                  currentCategory === category.id
                    ? 'bg-gray-500/90 text-gray-100 hover:bg-gray-600/90'
                    : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                } shadow-md`}
              >
                {category.categoryName}
              </Button>
            ))
          ) : (
            <div className="text-sm"> No categories available  </div>
          )}
        </div>

        <div className="space-y-2 sm:space-y-4">
          <div className="border p-2 sm:p-4 lg:p-4 rounded-lg shadow-lg backdrop-blur-lg bg-white/5">
            <div className="space-y-4 sm:md:xl:lg:w-[600px] mt-4 rounded-lg">
              {filteredEvents.length > 0 ? (
                paginate(filteredEvents).map((event) => {
                  const currentTime = new Date().getTime();
                  const startTime = new Date(event.startTime).getTime();
                  const endTime = new Date(event.endTime).getTime();
                  const isOngoing =
                    currentTime > startTime && currentTime < endTime;
                  const isEnded = currentTime > endTime;

                  return (
                    <div
                      key={event.id}
                      className="border p-2 sm:p-4 lg:p-4 rounded-lg flex flex-col items-center py-4 font-sans shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white/90"
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
                          isEnded
                            ? 'red'
                            : isOngoing
                            ? 'green'
                            : 'gray'
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
                      <div className="text-gray-600 font-sans bg-gray-300 flex rounded-full pl-2 my-1 text-xs lg:text-sm">
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
                  );
                })
              ) : (
                <p className="justify-center flex pb-4 text-xs lg:text-sm">
                  No events available
                </p>
              )}
            </div>
            {filteredEvents.length > eventsPerPage && (
              <div className="flex justify-between mt-4 text-xs lg:text-sm items-end">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  Previous
                </Button>
                <span className="p-1 bg-gray-500 text-gray-200 rounded-full px-4 h-7 flex items-end">
                  {currentPage} page {totalPages(filteredEvents)}
                </span>
                <Button
                  disabled={currentPage === totalPages(filteredEvents)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 
  )} 
  
  
  export default CategoryList; 