// src/lib/googleForms.ts
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { FoodEvent } from '@/types/events';

// Define a type for your form data
interface FoodEventSubmission {
  eventName: string;
  eventLocation: string;
  eventDate: string;
  startTime: string;
  endTime?: string; // optional
  eventDescription: string;
  foodTypes: string[];
  contactEmail: string;
  additionalNotes?: string; // optional
  registrationLink?: string;
  hostClub?: string;
}

// This will connect to your Google Sheet that receives form responses
export async function getFormResponses(): Promise<FoodEvent[]> {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID || '',
      serviceAccountAuth
    );
    
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['API Form'];
    const rows = await sheet.getRows();

    // Add console.log to see what the data looks like
    console.log('Sample row data:', {
      foodType: rows[0]?.get('Type of Food Offered'),
      allColumns: rows[0]?.toObject()
    });

    // Filter for approved events and map them to our FoodEvent type
    return rows
      .filter(row => row.get('Approval Status')?.toLowerCase() === 'approved')
      .map(row => ({
        event_name: row.get('Event Name') || '',
        event_location: row.get('Event Location') || '',
        event_date: row.get('Event Date') || '',
        start_time: row.get('Start Time') || '',
        end_time: row.get('End Time (Optional)') || undefined,
        event_description: row.get('Event Description') || '',
        food_types: [row.get('Type of Food Offered') || 'Not specified'],
        host_club: row.get('Host Club') || undefined,
        contact_email: row.get('Contact Email') || '',
        additional_notes: row.get('Any Additional Notes? (Optional)') || undefined,
        registration_link: row.get('Is Registration Required? If so, provide the link to register in "Other..."') || undefined,
        approval_status: 'approved' as const,
      }))
      // Optional: Sort by date
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  } catch (error) {
    console.error('Error fetching form responses:', error);
    throw error;
  }
}

// This will update the approval status in your Google Sheet
export async function updateApprovalStatus(_rowId: string, _status: 'approved' | 'rejected') {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),  // Fix private key formatting
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID || '',
    serviceAccountAuth
  );
  await doc.loadInfo();
  
  const sheet = doc.sheetsByTitle['API Form'];
  const rows = await sheet.getRows();
  
  const targetRow = rows.find(row => row.get('ID') === _rowId);
  if (!targetRow) {
    throw new Error(`Row with ID ${_rowId} not found`);
  }
  
  targetRow.set('Approval Status', _status);
  await targetRow.save();
}

// Update the function to use the parameters or remove them if not needed
export async function handleFormSubmission(formData: FoodEventSubmission) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID || '',
      serviceAccountAuth
    );
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['API Form'];
    
    // Add the new row
    await sheet.addRow({
      'Event Name': formData.eventName,
      'Event Location': formData.eventLocation,
      'Event Date': formData.eventDate,
      'Start Time': formData.startTime,
      'End Time (Optional)': formData.endTime || '',
      'Event Description': formData.eventDescription,
      'Type of Food Offered': formData.foodTypes.join(', '),
      'Host Club': formData.hostClub || '',
      'Contact Email': formData.contactEmail,
      'Any Additional Notes? (Optional)': formData.additionalNotes || '',
      'Is Registration Required? If so, provide the link to register in "Other..."': formData.registrationLink || '',
      'Approval Status': 'pending',
    });

    return {
      success: true,
      data: formData
    };
  } catch (error) {
    console.error('Sheet submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}