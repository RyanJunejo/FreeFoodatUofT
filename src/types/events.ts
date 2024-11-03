// src/types/events.ts
export interface FoodEvent {
    id: number;
    title: string;
    location: string;
    date: string;
    time: string;
    description: string;
    foodType: string;
    capacity: number;
    remaining: number;
  }
  
  export interface EventFormData {
    title: string;
    location: string;
    date: string;
    time: string;
    description: string;
    foodType: string;
    capacity: number;
  }