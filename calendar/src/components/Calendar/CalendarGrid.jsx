import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format 
} from 'date-fns';
import CalendarDay from './CalendarDay';

const CalendarGrid = ({ currentDate }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-grid">
      {weekDays.map(day => (
        <div key={day} className="weekday-header">
          {day}
        </div>
      ))}
      {calendarDays.map(day => (
        <CalendarDay
          key={day.toString()}
          date={day}
          isToday={isToday(day)}
          isCurrentMonth={isSameMonth(day, currentDate)}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;