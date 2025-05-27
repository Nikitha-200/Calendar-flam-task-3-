import React from 'react';
import { useEvents } from '../context/EventContext';
import { TextField, Select, MenuItem, Box } from '@mui/material';

const SearchFilter = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filterCategory, 
    setFilterCategory 
  } = useEvents();

  const categories = ['all', 'work', 'personal', 'meeting', 'other'];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2 }}>
      <TextField
        label="Search events"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ minWidth: 200 }}
      />
      <Select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        size="small"
        sx={{ minWidth: 120 }}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SearchFilter;