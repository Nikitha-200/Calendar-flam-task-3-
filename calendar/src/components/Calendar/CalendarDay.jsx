import React, { useState } from 'react';
import { format } from 'date-fns';
import { useEvents } from '../../context/EventContext';
import EventForm from '../Events/EventForm';

const CalendarDay = ({ date, isToday, isCurrentMonth }) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { getEventsByDate, addEvent, updateEvent, deleteEvent } = useEvents();
  const dayEvents = getEventsByDate(date);

  const handleDayClick = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleEventSubmit = (eventData) => {
    if (selectedEvent) {
      updateEvent({ ...eventData, id: selectedEvent.id });
    } else {
      addEvent({ ...eventData, date });
    }
    setShowEventForm(false);
  };

  const handleEventDelete = (eventId) => {
    if (!eventId) return;
    
    try {
      deleteEvent(eventId);
      setSelectedEvent(null);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div 
      className={`calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
      onClick={handleDayClick}
    >
      <div className="date">{format(date, 'd')}</div>
      <div className="events">
        {dayEvents.map(event => (
          <div
            key={event.id}
            className="event"
            style={{ backgroundColor: event.color }}
            onClick={(e) => handleEventClick(event, e)}
          >
            {event.title}
          </div>
        ))}
      </div>
      <EventForm
        open={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSubmit={handleEventSubmit}
        onDelete={handleEventDelete}
      />
    </div>
  );
};

export default CalendarDay;