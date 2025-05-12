"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you are using shadcn/ui
import { Input } from '@/components/ui/input'; // Assuming you are using shadcn/ui
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you are using shadcn/ui
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // Assuming you are using shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';  // Added for better UI
import { cn } from "@/lib/utils" //Added for conditional classes
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Image from 'next/image';

// Placeholder for fetching events (replace with your actual data fetching)
const fetchEvents = async () => {
  // Simulate fetching data from your backend API
  try {
    const response = await fetch('http://localhost:3001/api/events');
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // Re-throw to be caught in component
  }
};

const EventCard = ({ event }: { event: any }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(''); // New state for image URL

  useEffect(() => {
    // Update imageUrl only if event.images changes and there's no error
    if (event.images && event.images.length > 0) {
      setImageUrl(event.images[0]);
      setImageError(false); // Reset error state when a new image is available
    }
  }, [event.images]);

  const handleGetTickets = async () => {
    setLoading(true); // Start loading
    if (email && optIn) {
      // In a real application, you would send this data to your server
      console.log('Email:', email, 'Opt-in:', optIn);
      // Simulate a delay before redirecting
      setTimeout(() => {
        try {
          window.open(event.ticketUrl, '_blank'); // Open in new tab
        } catch (e) {
          console.error("Failed to open ticket URL", e);
          alert("Failed to open ticket URL. Please try again.");
        }

        setOpen(false); // Close the modal
        setEmail('');    //Clear form
        setOptIn(false);
        setLoading(false); // End loading
      }, 1000); // Simulate a 1-second delay
    } else {
      setLoading(false);
      alert('Please enter your email and agree to receive updates.'); // Basic validation
    }
  };

  return (
    <>
      <Card className="mb-4 transition-transform transform hover:scale-105 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
          <CardDescription>
            {event.date} - {event.time} | {event.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imageUrl && !imageError ? (
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              import Image from 'next/image';

<Image
  src={imageUrl}
  alt={event.title}
  width={400} // adjust width & height as needed
  height={200}
  className="object-cover w-full h-full"
  onError={() => {
    setImageError(true);
    setImageUrl('');
  }}
/>

            </div>
          ) : (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Image Unavailable</AlertTitle>
              <AlertDescription>
                Sorry, the image for this event could not be loaded.
              </AlertDescription>
            </Alert>
          )}
          <p className="mb-4 text-gray-700">{event.description.substring(0, 100)}...</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Get Tickets
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Get Tickets for {event.title}</DialogTitle>
                <DialogDescription>
                  Enter your email to receive updates and access the ticket purchase page.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="opt-in" className="text-right">
                    Opt-in
                  </label>
                  <Checkbox
                    id="opt-in"
                    checked={optIn}
                    onCheckedChange={setOptIn}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleGetTickets}
                  disabled={loading} // Disable button while loading
                  className={cn(
                    loading && "animate-pulse" // Apply animation
                  )}
                >
                  {loading ? 'Loading...' : 'Get Tickets'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
};

const HomePage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching events.');
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Events in Sydney</h1>
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
      {events.length === 0 && (
        <div className="text-center text-gray-500">
          <p>No events found.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

