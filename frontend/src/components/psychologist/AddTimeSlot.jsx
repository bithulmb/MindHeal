import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

const timeSlotSchema = z
  .object({
    date: z
      .string()
      .min(1, 'Date is required'),
     
    start_time: z.string().min(1, 'Start time is required'),
  })
  .refine(
    (data) => {
      const now = new Date();
      const selectedDate = new Date(data.date);
      //checking if the time selected is less than the current time if date is today
      if (
        selectedDate.toDateString() === now.toDateString() &&
        data.start_time < now.toTimeString().slice(0, 5)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Start time cannot be in the past for today',
      path: ['start_time'],
    }
  );

const AddTimeSlot = ({ onSuccess }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timeOptions = generateTimeOptions();


  const today = new Date().toISOString().split('T')[0]; //todays date

  const form = useForm({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      date: '',
      start_time: '',
    },
  });

  const onSubmit = async (data) => {
    setMessage('');
    setError('');
    setLoading(true);

    const [hours, minutes] = data.start_time.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours));
    startDate.setMinutes(parseInt(minutes));
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const submitData = {
      ...data,
      end_time: endTime,
    };

    try {
      await api.post('/api/timeslots/', submitData);
      setMessage('Time slot added successfully!');
      form.reset();
      onSuccess();
    } catch (err) {
      if (err.response && err.response.data) {
        
        setError(err?.response?.data?.non_field_errors || err.response?.data); 
      } else {
        setError({ non_field_errors: ['Failed to add time slot. Server error.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6  rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Add Available Time Slot
      </h2>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
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
                <FormLabel className="text-gray-800 dark:text-gray-200">Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={today}  // Disable past dates
                    className="w-full text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Time Dropdown */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-gray-200">Start Time</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded-md border p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="" className="text-gray-800 dark:text-gray-200">
                      Select start time
                    </option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time} className="text-gray-800 dark:text-gray-200">
                        {time}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Time Slot'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTimeSlot;