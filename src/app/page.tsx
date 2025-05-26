"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';  
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; 
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" 
import { AlertCircle } from "lucide-react" 
import Image from 'next/image'; 

const fetchEvents = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/events');
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const EventCard = ({ event }: { event: any }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleGetTickets = async () => {
    setLoading(true);
    if (email && optIn) {
      console.log('Email:', email, 'Opt-in:', optIn);
      setTimeout(() => {
        try {
          window.open(event.ticketUrl, '_blank');
        } catch (e) {
          console.error("Failed to open ticket URL", e);
          alert("Failed to open ticket URL. Please try again.");
        }

        setOpen(false);
        setEmail('');
        setOptIn(false);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
      alert('Please enter your email and agree to receive updates.');
    }
  };

  return (
    <Card
      className="mb-6 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border border-red-900/50 bg-black text-red-900 flex flex-col h-full"
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold text-red-700">{event.title}</CardTitle>
        <CardDescription className="text-red-500">
          {event.date} - {event.time} | Sydney
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="text-sm text-red-300 leading-relaxed">
          <p>{event.description}</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Date:</strong> {event.date}</li>
            <li><strong>Time:</strong> {event.time}</li>
            <li><strong>Location:</strong> Sydney</li>
            {event.artists && event.artists.length > 0 && (
              <li>
                <strong>Artists:</strong> {event.artists.join(', ')}
              </li>
            )}
            {event.genre && (<li><strong>Genre:</strong> {event.genre}</li>)}
            {event.ageRestriction && (<li><strong>Age Restriction:</strong> {event.ageRestriction}</li>)}
          </ul>
          {event.additionalInfo && (
            <p className="mt-4 text-xs">{event.additionalInfo}</p>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-red-900/10 text-red-900 hover:bg-red-900/20 hover:text-white border-red-900/50 hover:border-red-900/70 shadow-lg hover:shadow-red-900/20 transition-all duration-300 font-bold"
              >
                Get Tickets
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px] bg-white text-red-900 border-red-900/50 shadow-2xl backdrop-blur-md rounded-xl"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-red-700">
                  Get Tickets for {event.title}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Enter your email to receive updates and access the ticket purchase page.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="email"
                    className="text-right text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3 bg-red-50/50 text-red-900 border-red-900/50 placeholder:text-red-400 rounded-md"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="opt-in"
                    className="text-right text-gray-700"
                  >
                    Opt-in
                  </label>
                  <Checkbox
                    id="opt-in"
                    checked={optIn}
                    onCheckedChange={(checked) =>{
                      if(checked!=="indeterminate"){
                        setOptIn(checked);
                      }
                    }}
                    className="col-span-3 border-red-900/50 rounded-md"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleGetTickets}
                  disabled={loading}
                  className="w-full bg-red-900 text-white hover:bg-red-800 transition-all duration-300 font-bold rounded-md"
                >
                  {loading ? 'Loading...' : 'Get Tickets'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
      </CardContent>
    </Card>
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
      <div className="flex flex-col items-center justify-center h-screen bg-black text-red-500">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-red-700"></div>
          <span className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
          🔥
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-wide mb-2 animate-pulse">
          Fetching the Hottest Events...
        </h2>
        <p className="text-sm text-red-300">
          Hang tight! We're gathering Sydney's finest for you.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100-">
        <Alert
          variant="destructive"
          className="bg-red-900 text-white rounded-xl"
        >
          <AlertCircle className="h-5 w-5 text-white" />
          <AlertTitle className="text-white">Error</AlertTitle>
          <AlertDescription className="text-white">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Dummy hero data
  const heroData = {
    title: "Discover the Best Events in Sydney",
    description: "Find and book tickets for concerts, festivals, and more.",
    imageUrl: "/sydney.jpg", // Replace with an actual image URL
  };

  return (
    <div className="bg-gray-950">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] flex items-center justify-center bg-gray-900">
        <Image
          src={heroData.imageUrl}
          alt={heroData.title}
          layout="fill"
          objectFit="cover"
          className="opacity-50 rounded-b-xl" // Reduced opacity and rounded bottom
        />
        <div className="absolute z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4
                       tracking-tight drop-shadow-lg"
          >
            {heroData.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
            {heroData.description}
          </p>
          <Button
            className="mt-8 bg-red-900 text-white hover:bg-red-800
                                  px-8 py-3 rounded-full text-lg
                                  transition-all duration-300 shadow-lg
                                  font-semibold" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} // Smooth scroll to events section
          >
            Explore Events
          </Button>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto p-4 bg-black">
        <h1
          className="text-4xl font-bold mb-12 text-center text-white
                     tracking-tight drop-shadow-lg"
        >
          Upcoming Events in Sydney
        </h1>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" // 4-column grid
        >
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -50, rotate: 10 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {events.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-300 py-8">
            <p className="text-lg">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

