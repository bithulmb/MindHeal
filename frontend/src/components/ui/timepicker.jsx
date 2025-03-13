// components/ui/TimePicker.jsx
import React from 'react';

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

const TimePicker = ({ value, onChange, disabledTimes = [], ...props }) => {
  const timeOptions = generateTimeOptions();

  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-md border p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      <option value="">Select time</option>
      {timeOptions.map((time) => (
        <option
          key={time}
          value={time}
          disabled={disabledTimes.includes(time)}
        >
          {time}
        </option>
      ))}
    </select>
  );
};

export default TimePicker;