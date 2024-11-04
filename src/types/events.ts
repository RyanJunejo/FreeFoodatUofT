export interface FoodEvent {
  event_name: string;
  event_location: string;
  event_date: string;
  start_time: string;
  event_description?: string;
  food_types: string[];
  host_club?: string;
  registration_link?: string;
  contact_email?: string;
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