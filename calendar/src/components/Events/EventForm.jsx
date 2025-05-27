import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  DialogContentText 
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const EventForm = ({ open, onClose, event, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    description: '',
    recurrence: 'none',
    color: '#1976d2'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFormData({
      title: '',
      date: new Date(),
      description: '',
      recurrence: 'none',
      color: '#1976d2'
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (!event?.id) return;
    
    try {
      onDelete(event.id);
      setShowDeleteConfirm(false);
      handleClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: new Date(event.date)
      });
    } else {
      setFormData({
        title: '',
        date: new Date(),
        description: '',
        recurrence: 'none',
        color: '#1976d2'
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const baseEvent = {
      ...formData,
      date: new Date(formData.date).toISOString()
    };

    if (event) {
      // For editing existing event
      onSubmit({
        ...event,
        ...baseEvent,
        id: event.id,
        recurrence: formData.recurrence,
        isRecurring: formData.recurrence !== 'none',
        originalEventId: event.originalEventId || event.id // Track the original event for recurring series
      });
    } else {
      // For new events
      const newEventData = {
        ...baseEvent,
        isRecurring: formData.recurrence !== 'none',
        originalEventId: null // Will be set to the event's ID after creation
      };
      onSubmit(newEventData);
    }
    onClose();
  };

  useEffect(() => {
    if (event) {
      // Preserve all existing event data including recurrence
      setFormData({
        ...event,
        date: new Date(event.date),
        recurrence: event.recurrence || 'none'  // Ensure recurrence is preserved
      });
    } else {
      setFormData({
        title: '',
        date: new Date(),
        description: '',
        recurrence: 'none',
        color: '#1976d2'
      });
    }
  }, [event]);

  // Remove handleEdit function since we're handling edits in handleSubmit

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date & Time"
                value={formData.date}
                onChange={(newDate) => setFormData({ ...formData, date: newDate })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
  
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
  
            <FormControl fullWidth margin="normal">
              <InputLabel>Recurrence</InputLabel>
              <Select
                value={formData.recurrence}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                label="Recurrence"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
  
            <TextField
              fullWidth
              type="color"
              label="Event Color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            {event && (
              <Button 
                onClick={handleDelete}
                color="error"
                type="button"
                sx={{ marginRight: 'auto' }}
              >
                Delete
              </Button>
            )}
            <Button 
              onClick={(e) => handleClose(e)} 
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {event ? 'Save Changes' : 'Add Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  
      {/* Update the Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteConfirm} 
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{event?.title || 'this event'}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventForm;