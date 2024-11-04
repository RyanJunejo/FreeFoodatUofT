import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { FoodEvent } from "@/types/events"

interface EventCardProps {
  event: FoodEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.event_name}</CardTitle>
        {event.host_club && (
          <CardDescription>Hosted by: {event.host_club}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {/* ... existing content ... */}
      </CardContent>
      <CardFooter>
        {event.registration_link ? (
          <a 
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Registration Required →
          </a>
        ) : (
          <span className="text-gray-500">No Registration Required</span>
        )}
      </CardFooter>
    </Card>
  )
} 