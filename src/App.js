import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Sample event data
const events = [
  {
    id: 1,
    title: 'Pizza at Computer Science Department',
    start: new Date(2024, 9, 15, 12, 0), // Note: month is 0-indexed
    end: new Date(2024, 9, 15, 14, 0),
    location: 'Bahen Centre',
    foodType: 'Pizza'
  },
  {
    id: 2,
    title: 'Snacks at Engineering Society Meetup',
    start: new Date(2024, 9, 16, 15, 0),
    end: new Date(2024, 9, 16, 17, 0),
    location: 'Sandford Fleming Building',
    foodType: 'Assorted Snacks'
  },
  // Add more events as needed
];

const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">UofT Free Food Events</h1>
      <div className="h-3/4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          style={{ height: '100%' }}
        />
      </div>
      {selectedEvent && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
          <p>Date: {moment(selectedEvent.start).format('MMMM D, YYYY')}</p>
          <p>Time: {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}</p>
          <p>Location: {selectedEvent.location}</p>
          <p>Food: {selectedEvent.foodType}</p>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;