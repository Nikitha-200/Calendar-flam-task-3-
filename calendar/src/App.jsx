import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Calendar from './components/Calendar/Calendar';
import { EventProvider } from './context/EventContext';

function App() {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    // Handle drag end logic here
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <EventProvider>
        <Calendar />
      </EventProvider>
    </DragDropContext>
  );
}

export default App;
