import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const CalendarHeader = ({ currentDate, onPreviousMonth, onNextMonth }) => {
  return (
    <div className="calendar-header">
      <button onClick={onPreviousMonth}>
        <ChevronLeft />
      </button>
      <h2>{format(currentDate, 'MMMM yyyy')}</h2>
      <button onClick={onNextMonth}>
        <ChevronRight />
      </button>
    </div>
  );
};

export default CalendarHeader;