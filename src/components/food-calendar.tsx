// src/components/food-calendar.tsx
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FoodEvent } from '@/types/events';

// Add your Google Form URL
const GOOGLE_FORM_URL = "https://forms.gle/Q6rcUqQTCdpGwU1F9";

// Extract the event card into a separate component
const EventCard: React.FC<{ event: FoodEvent }> = ({ event }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.event_name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin size={16} /> {event.event_location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>{event.event_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{event.start_time}</span>
            </div>
            {event.host_club && (
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Hosted by: {event.host_club}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div>Food: {Array.isArray(event.food_types) ? 
              event.food_types.map((food, i) => (
                <span key={`${food}-${i}`} className="mr-2">{food}</span>
              )) : 
              event.food_types}
            </div>
            <div>
              {event.registration_link && event.registration_link.toLowerCase() !== 'no' ? (
                <a 
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  Registration Required →
                </a>
              ) : (
                <span className="text-gray-500">No Registration Required</span>
              )}
            </div>
          </div>
        </div>
        {event.event_description && (
          <div className="mt-4 text-gray-600">
            {event.event_description}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add these helper functions at the top of the file
const compareTimes = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  if (h1 !== h2) return h1 - h2;
  return m1 - m2;
};

const compareDates = (date1: string, date2: string): number => {
  const [d1, m1, y1] = date1.split('/').map(Number);
  const [d2, m2, y2] = date2.split('/').map(Number);
  if (y1 !== y2) return y1 - y2;
  if (m1 !== m2) return m1 - m2;
  return d1 - d2;
};

export default function FoodEventCalendar() {
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching events...');
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data.events) {
        throw new Error('No events data received');
      }
      
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const groupEventsByDate = useCallback((events: FoodEvent[]) => {
    // First filter events by search query
    const filteredEvents = events.filter(event => {
      const searchTerms = searchQuery.toLowerCase().trim();
      if (!searchTerms) return true;
      
      return (
        event.event_name.toLowerCase().includes(searchTerms) ||
        event.event_location.toLowerCase().includes(searchTerms) ||
        event.event_description?.toLowerCase().includes(searchTerms) ||
        event.host_club?.toLowerCase().includes(searchTerms) ||
        (Array.isArray(event.food_types) && 
          event.food_types.some(food => food.toLowerCase().includes(searchTerms)))
      );
    });

    // Convert selected date to a Date object for comparison
    const [year, month, day] = selectedDate.split('-');
    const selectedDateObj = new Date(`${year}-${month}-${day}`);

    const groups = filteredEvents
      .filter(event => {
        const [eventDay, eventMonth, eventYear] = event.event_date.split('/');
        const eventDateObj = new Date(`${eventYear}-${eventMonth}-${eventDay}`);
        return eventDateObj >= selectedDateObj;
      })
      .reduce((groups, event) => {
        const [eventDay, eventMonth, eventYear] = event.event_date.split('/');
        const eventDateObj = new Date(`${eventYear}-${eventMonth}-${eventDay}`);
        
        if (eventDateObj.getTime() === selectedDateObj.getTime()) {
          groups.today.push(event);
        } else if (eventDateObj > selectedDateObj) {
          groups.upcoming.push(event);
        }
        return groups;
      }, { today: [] as FoodEvent[], upcoming: [] as FoodEvent[] });

    // Sort today's events by time only
    groups.today.sort((a, b) => compareTimes(a.start_time, b.start_time));

    // Sort upcoming events by date first, then time
    groups.upcoming.sort((a, b) => {
      const dateComparison = compareDates(a.event_date, b.event_date);
      if (dateComparison === 0) {
        return compareTimes(a.start_time, b.start_time);
      }
      return dateComparison;
    });

    return groups;
  }, [selectedDate, searchQuery]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">FreeFood@UofT</h1>
        <p className="text-gray-600">Reducing food insecurity on campus one event at a time!</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <input 
            type="date" 
            className="border p-2 rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="border p-2 rounded w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Event
        </a>
      </div>

      <div className="space-y-8">
        {events.length > 0 ? (
          <>
            {(() => {
              const groupedEvents = groupEventsByDate(events);
              return (
                <>
                  {groupedEvents.today.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Events Happening on {(() => {
                          const [year, month, day] = selectedDate.split('-');
                          return new Date(
                            parseInt(year),
                            parseInt(month) - 1,
                            parseInt(day)
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        })()}
                      </h2>
                      <div className="space-y-4">
                        {groupedEvents.today.map((event, index) => (
                          <EventCard key={`${event.event_name}-${event.event_date}-${index}`} event={event} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {groupedEvents.upcoming.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                      <div className="space-y-4">
                        {groupedEvents.upcoming.map((event, index) => (
                          <EventCard key={`${event.event_name}-${event.event_date}-${index}`} event={event} />
                        ))}
                      </div>
                    </div>
                  )}

                  {groupedEvents.today.length === 0 && groupedEvents.upcoming.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No events found for the selected date or later.
                    </div>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No approved events at this time. Check back later or submit a new event!
          </div>
        )}
      </div>
    </div>
  );
}