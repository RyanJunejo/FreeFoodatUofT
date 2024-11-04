import { handleFormSubmission } from '@/lib/googleForms';



export async function POST(req: Request) {
  try {
    const formData = await req.json();
    console.log('Received form data:', formData);

    const result = await handleFormSubmission(formData);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return new Response(JSON.stringify({ success: true, data: result.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: Error | unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}