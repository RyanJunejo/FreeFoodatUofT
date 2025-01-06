export interface FoodEvent {
  event_name: string;
  event_location: string;
  event_date: string;
  start_time: string;
  event_description?: string;
  host_club?: string;
  food_types: string[] | string;
  registration_link?: string;
  campus: 'UTSG' | 'UTM' | 'UTSC';
}

export interface EventFormData {
  eventName: string;
  eventLocation: string;
  eventDate: string;
  startTime: string;
  eventDescription: string;
  foodTypes: string[];
  registrationLink?: string;  // Add this
  hostClub?: string;         // Add this
  contactEmail: string;
  additionalNotes?: string;
}