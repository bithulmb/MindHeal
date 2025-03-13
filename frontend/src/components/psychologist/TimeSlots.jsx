import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '../api/api';
import AddTimeSlot from './AddTimeSlot';
import Swal from 'sweetalert2';

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('api/timeslots/');
      setTimeSlots(response.data);
    } catch (err) {
      setError('Failed to fetch time slots.');
    } finally {
      setLoading(false);
    }
  };

  const refreshTimeSlots = async () => {
    try {
      const response = await api.get('/api/timeslots/');
      setTimeSlots(response.data);
    } catch (err) {
      setError('Failed to refresh time slots.');
    }
  };

  const handleDelete = async (slotId) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/timeslots/${slotId}/`);
          setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId));
          Swal.fire({
            title: 'Cancelled!',
            text: 'Your time slot has been cancelled.',
            icon: 'success',
          });
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete time slot.',
            icon: 'error',
          });
        }
      }
    });
  };

  // Get unique dates from timeslots
  const getUniqueDates = () => {
    const dates = [...new Set(timeSlots.map(slot => slot.date))];
    return dates.sort();
  };

  // Get timeslots for selected date
  const getSlotsForDate = (date) => {
    return timeSlots.filter(slot => slot.date === date);
  };

  // Month navigation handlers
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null); // Clear selected date when changing months
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null); // Clear selected date when changing months
  };

  // Generate calendar view for current month
  const renderCalendar = () => {
    const uniqueDates = getUniqueDates();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = monthStart.getDay();
    
    const calendarDays = [];
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || dayCount > daysInMonth) {
          week.push(<div key={`${i}-${j}`} className="h-20 border"></div>);
        } else {
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
          const hasSlots = uniqueDates.includes(dateStr);
          week.push(
            <div
              key={`${i}-${j}`}
              className={`h-20 border p-2 cursor-pointer ${hasSlots ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-300' : 'hover:bg-gray-400'}`}
              onClick={() => hasSlots && setSelectedDate(dateStr)}
            >
              {dayCount}
              {hasSlots && <div className="text-xs">Slots added</div>}
            </div>
          );
          dayCount++;
        }
      }
      calendarDays.push(<div key={i} className="grid grid-cols-7">{week}</div>);
    }

    return calendarDays;
  };

  // Format month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const getMonthYear = () => {
    return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  return (
    <div className="w-full bg-primary-foreground p-6 flex flex-col gap-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold">Manage Your Time Slots</h2>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium"></h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="" className="text-sm">
                Add Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <AddTimeSlot onSuccess={refreshTimeSlots} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : (
          <div className="flex gap-4">
            {/* Calendar View */}
            <div className="w-2/3 border rounded-lg">
              <div className="flex justify-between items-center p-2 ">
                <Button variant="ghost" onClick={prevMonth}>
                  ← Prev
                </Button>
                <h4 className="font-semibold">{getMonthYear()}</h4>
                <Button variant="ghost" onClick={nextMonth}>
                  Next →
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 p-2 ">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-bold">{day}</div>
                ))}
              </div>
              <div className="border-t">{renderCalendar()}</div>
            </div>

            {/* Selected Date Timeslots */}
            {selectedDate && (
              <div className="w-1/3 border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Slots for {selectedDate}</h4>
                {getSlotsForDate(selectedDate).map(slot => (
                  <div
                    key={slot.id}
                    className={`p-2 mb-2 rounded ${
                      slot.is_booked ? 'bg-red-100 dark:bg-red-700' : 'bg-green-100 dark:bg-green-700'
                    }`}
                  >
                    <div>
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </div>
                    <div className="text-sm">
                      {slot.is_booked ? 'Booked' : 'Not booked'}
                    </div>
                    {!slot.is_booked && (
                      <Button
                        variant="outline-danger"
                        size="xsm"
                        onClick={() => handleDelete(slot.id)}
                        className="mt-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlots;