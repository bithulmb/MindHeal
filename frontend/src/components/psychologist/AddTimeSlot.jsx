import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '../api/api';

// Generate time options from 08:00 to 22:00 in 30-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 8; hour <= 22; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return times;
};

const timeSlotSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  selectedTimeSlots: z.array(z.string()).min(1, 'Select at least one time slot'),
});

// Helper to convert time string to minutes for easier comparison
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check if two time slots overlap (considering 1-hour duration)
const checkOverlap = (time1, time2) => {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + 60; // 1 hour slot
  const start2 = timeToMinutes(time2);
  const end2 = start2 + 60; // 1 hour slot
  
  // Check for overlap
  return (start1 < end2 && start2 < end1);
};

const AddTimeSlots = ({ onSuccess }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [disabledSlots, setDisabledSlots] = useState({});

  const timeOptions = generateTimeOptions();
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      date: '',
      selectedTimeSlots: [],
    },
  });

  // Update disabled slots whenever selected slots change
  useEffect(() => {
    const selectedSlots = form.watch('selectedTimeSlots') || [];
    
    // Reset disabled slots
    const newDisabledSlots = {};
    
    // For each selected slot, disable overlapping slots
    selectedSlots.forEach(selectedTime => {
      timeOptions.forEach(timeOption => {
        // If this is not the selected time and it overlaps, disable it
        if (timeOption !== selectedTime && checkOverlap(selectedTime, timeOption)) {
          newDisabledSlots[timeOption] = true;
        }
      });
    });
    
    setDisabledSlots(newDisabledSlots);
  }, [form.watch('selectedTimeSlots')]);

  // Handle date change to filter valid time slots
  const handleDateChange = (date) => {
    form.setValue('date', date);
    
    // Clear previously selected time slots
    form.setValue('selectedTimeSlots', []);
    setDisabledSlots({});
    
    // Filter time slots if date is today
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
    
    const isToday = date === today;
    
    // Filter out past times if the selected date is today
    const filteredTimeSlots = isToday 
      ? timeOptions.filter(time => time > currentTime)
      : timeOptions;
      
    setTimeSlots(filteredTimeSlots);
  };

  const onSubmit = async (data) => {
    setMessage('');
    setError('');
    setLoading(true);
    
    try {
      // Create an array of slot objects to submit
      const slotsToSubmit = data.selectedTimeSlots.map(startTime => {
        // Calculate end time (1 hour after start time)
        const [hours, minutes] = startTime.split(':');
        const startDate = new Date();
        startDate.setHours(parseInt(hours));
        startDate.setMinutes(parseInt(minutes));
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
          .getMinutes()
          .toString()
          .padStart(2, '0')}`;
          
        return {
          date: data.date,
          start_time: startTime,
          end_time: endTime
        };
      });
      
      // Submit all slots in a single bulk request
      await api.post('/api/timeslots/bulk/', { timeslots: slotsToSubmit });
      
      setMessage(`Successfully added ${slotsToSubmit.length} time slots!`);
      form.reset();
      onSuccess();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err?.response?.data?.non_field_errors || JSON.stringify(err.response?.data));
      } else {
        setError('Failed to add time slots. Server error.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (time, checked) => {
    const currentSelected = form.getValues('selectedTimeSlots') || [];
    
    if (checked) {
      // Add the time slot
      form.setValue('selectedTimeSlots', [...currentSelected, time]);
    } else {
      // Remove the time slot
      form.setValue(
        'selectedTimeSlots', 
        currentSelected.filter(slot => slot !== time)
      );
    }
  };

  const toggleAllTimeSlots = () => {
    const currentSelected = form.getValues('selectedTimeSlots');
    
    if (currentSelected.length === 0) {
      // Select all non-overlapping slots (select first available slot of each hour)
      const nonOverlappingSlots = timeSlots.filter(time => time.endsWith(':00'));
      form.setValue('selectedTimeSlots', nonOverlappingSlots);
    } else {
      // Deselect all
      form.setValue('selectedTimeSlots', []);
    }
  };

  return (
    <Card className="max-w-6xl mx-auto mt-6 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Schedule Multiple Time Slots
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-2">
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Select Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={today}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Slot Selection */}
            {form.watch('date') && (
              <FormField
                control={form.control}
                name="selectedTimeSlots"
                render={() => (
                  <FormItem>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          Available Time Slots
                        </FormLabel>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={toggleAllTimeSlots}
                          className="text-sm"
                        >
                          {form.watch('selectedTimeSlots').length === 0 ? 'Select Hourly Slots' : 'Clear Selection'}
                        </Button>
                      </div>
                      
                      {timeSlots.length === 0 ? (
                        <div className="text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/30 rounded">
                          No available time slots for this date.
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50 max-h-80 overflow-y-auto">
                          {timeSlots.map((time) => {
                            const isSelected = form.watch('selectedTimeSlots')?.includes(time);
                            const isDisabled = disabledSlots[time] && !isSelected;
                            
                            return (
                              <div 
                                key={time}
                                className={`flex items-center space-x-2 p-2 rounded ${
                                  isDisabled ? 'opacity-50 bg-gray-100 dark:bg-gray-700' : 
                                  isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onCheckedChange={(checked) => handleTimeSlotChange(time, checked)}
                                  className={isSelected ? 'border-blue-500' : ''}
                                />
                                <label 
                                  className={`text-sm ${isDisabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'} cursor-pointer select-none`}
                                  onClick={() => !isDisabled && handleTimeSlotChange(time, !isSelected)}
                                >
                                  {time} 
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>Each slot will be 1 hour long. Overlapping slots are automatically disabled.</p>
                        <p className="mt-1">Selected slots: <span className="font-semibold">{form.watch('selectedTimeSlots')?.length || 0}</span></p>
                      </div>
                      
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || form.watch('selectedTimeSlots')?.length === 0}
            >
              {loading ? 'Adding Time Slots...' : 'Add Selected Time Slots'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTimeSlots;