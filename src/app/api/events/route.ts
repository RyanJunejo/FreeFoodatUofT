import { getFormResponses } from '@/lib/googleForms';

export async function GET(): Promise<Response> {
  try {
    const events = await getFormResponses();
    
    console.log('Fetched events:', {
      count: events.length,
      firstEvent: events[0] // Log first event for debugging
    });

    return Response.json({ 
      success: true,
      events 
    });
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    
    return Response.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}       