import BookingClient from "./page-client";

// This is a Next.js Server Component.
// It's a great place to fetch data from the database.
export default async function BookingPage() {
  
  // In a real application, you would fetch the coach's available dates here.
  // For example:
  // const availabilities = await prisma.availability.findMany({
  //   where: { coachId: 'some-coach-id' },
  //   select: { startTime: true }
  // });
  // const availableDates = availabilities.map(a => a.startTime);
  
  // For this demo, we'll use some mock data.
  const today = new Date();
  const mockAvailableDates = [
    new Date(today.setDate(today.getDate() + 2)),
    new Date(today.setDate(today.getDate() + 1)),
    new Date(today.setDate(today.getDate() + 3)),
  ];

  return <BookingClient availableDates={mockAvailableDates} />;
} 