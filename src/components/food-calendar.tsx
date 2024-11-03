// src/components/food-calendar.tsx
"use client";
import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FoodEvent } from '@/types/events';

export default function FoodEventCalendar() {
  const [events, setEvents] = useState<FoodEvent[]>([
    {
      id: 1,
      title: "CS Department Meet & Greet",
      location: "Bahen Centre Room 2270",
      date: "2024-11-02",
      time: "12:00 PM",
      description: "Pizza and refreshments provided",
      foodType: "Pizza",
      capacity: 50,
      remaining: 35
    },
    {
      id: 2,
      title: "Engineering Society Social",
      location: "Sandford Fleming Building",
      date: "2024-11-02",
      time: "3:00 PM",
      description: "Snacks and beverages available",
      foodType: "Mixed Snacks",
      capacity: 100,
      remaining: 80
    }
  ]);

  const handleAddEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add form handling logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">UofT Free Food Finder</h1>
        <p className="text-gray-600">Never miss a free meal on campus again!</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <input 
            type="date" 
            className="border p-2 rounded"
            defaultValue="2024-11-02"
          />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="border p-2 rounded w-64"
          />
        </div>
        
        <Dialog>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <Plus size={20} />
            Add Event
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Food Event</DialogTitle>
              <DialogDescription>
                Share details about a free food event on campus
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4 mt-4">
              <input 
                type="text" 
                placeholder="Event Title" 
                className="w-full border p-2 rounded"
                required
              />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full border p-2 rounded"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" 
                  className="border p-2 rounded"
                  required
                />
                <input 
                  type="time" 
                  className="border p-2 rounded"
                  required
                />
              </div>
              <textarea 
                placeholder="Description" 
                className="w-full border p-2 rounded"
                rows={3}
                required
              />
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
              >
                Submit Event
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin size={16} /> {event.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={16} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>Food: {event.foodType}</div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{event.remaining} spots left</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}