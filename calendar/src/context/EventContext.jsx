import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSameDay, addDays, addWeeks, addMonths } from 'date-fns';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    const baseEventWithId = {
      ...newEvent,
      id: `event_${Date.now()}`,
      date: new Date(newEvent.date).toISOString(),
      isRecurring: newEvent.recurrence !== 'none'
    };

    if (newEvent.recurrence !== 'none') {
      const recurringEvents = generateRecurringEvents(baseEventWithId);
      setEvents(prev => [...prev, ...recurringEvents]);
    } else {
      setEvents(prev => [...prev, baseEventWithId]);
    }
    return true;
  };

  const updateEvent = (updatedEvent) => {
    const eventWithSerializedDate = {
      ...updatedEvent,
      date: new Date(updatedEvent.date).toISOString()
    };

    if (updatedEvent.recurrence !== 'none') {
      const filteredEvents = events.filter(event => 
        event.originalEventId !== updatedEvent.id && 
        event.id !== updatedEvent.id
      );
      
      const recurringEvents = generateRecurringEvents(eventWithSerializedDate);
      setEvents([...filteredEvents, ...recurringEvents]);
    } else {
      setEvents(prev => prev.map(event =>
        event.id === updatedEvent.id ? eventWithSerializedDate : event
      ));
    }
    return true;
  };

  const deleteEvent = (eventId) => {
    try {
      const eventToDelete = events.find(event => event.id === eventId);
      if (!eventToDelete) {
        console.error('Event not found:', eventId);
        return false;
      }

      const updatedEvents = events.filter(event => 
        event.id !== eventId && 
        event.originalEventId !== eventId &&
        event.originalEventId !== eventToDelete.originalEventId
      );

      setEvents(updatedEvents);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };

  const generateRecurringEvents = (baseEvent) => {
      const events = [];  // Don't include base event in array initially
      const startDate = new Date(baseEvent.date);
      const numberOfOccurrences = 52;
  
      // Add the base event first with proper formatting
      events.push({
        ...baseEvent,
        id: baseEvent.id,
        date: startDate.toISOString(),
        isRecurring: true,
        originalEventId: null  // Base event has no original ID
      });
  
      for (let i = 1; i < numberOfOccurrences; i++) {
        let nextDate;
        
        switch (baseEvent.recurrence) {
          case 'daily':
            nextDate = addDays(startDate, i);
            break;
          case 'weekly':
            nextDate = addWeeks(startDate, i);
            break;
          case 'monthly':
            nextDate = addMonths(startDate, i);
            break;
          default:
            continue;
        }
  
        const recurringEvent = {
          ...baseEvent,
          id: `${baseEvent.id}_${i}`,
          date: nextDate.toISOString(),
          originalEventId: baseEvent.id,
          isRecurring: true
        };
        
        events.push(recurringEvent);
      }
  
      // Log events for debugging
      console.log('Generated recurring events:', events.length, 'events');
      return events;
    };

  const moveEvent = (eventId, newDate) => {
    const eventToMove = events.find(e => e.id === eventId);
    if (eventToMove) {
      const updatedEvent = {
        ...eventToMove,
        date: newDate
      };
      updateEvent(updatedEvent);
      return true;
    }
    return false;
  };

  const getEventsByDate = (date) => {
    const matchingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const targetDate = new Date(date);
      
      const matchesSearch = searchTerm.toLowerCase() === '' || 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = filterCategory === 'all' || 
        event.category === filterCategory;

      return isSameDay(eventDate, targetDate) && matchesSearch && matchesCategory;
    });
    return matchingEvents;
  };

  const filterEvents = (searchText) => {
    setSearchTerm(searchText);
  };

  const filterByCategory = (category) => {
    setFilterCategory(category);
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventsByDate,
      moveEvent,
      searchTerm,
      setSearchTerm,
      filterCategory,
      setFilterCategory,
      filterEvents,
      filterByCategory,
    }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;