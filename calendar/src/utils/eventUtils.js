export const checkEventConflict = (newEvent, existingEvents) => {
  return existingEvents.some(event => {
    const newStart = new Date(newEvent.date);
    const existingStart = new Date(event.date);
    
    // Check if events are on the same day and time
    return (
      event.id !== newEvent.id &&
      newStart.getFullYear() === existingStart.getFullYear() &&
      newStart.getMonth() === existingStart.getMonth() &&
      newStart.getDate() === existingStart.getDate() &&
      newStart.getHours() === existingStart.getHours()
    );
  });
};

export const searchEvents = (events, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return events.filter(event => 
    event.title.toLowerCase().includes(term) ||
    event.description.toLowerCase().includes(term)
  );
};