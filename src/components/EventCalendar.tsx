"use client"

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaEllipsisH } from 'react-icons/fa';
import { FaE } from 'react-icons/fa6';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

//temporary data for events, you can replace this with your actual event data
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit"
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit"
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit"
  },
]

const EventCalendar = () => {
   const [value, onChange] = useState<Value>(new Date());
  return (
    <div className='bg-white p-4 '>
      <Calendar locale='en-GB' onChange={onChange} value={value} />
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold my-4'>Events</h1>
        <FaEllipsisH className='w-5 h-5 text-gray-500'/>
      </div>
      <div className='flex flex-col gap-4'>
        {events.map((event) => (
          <div key={event.id} className='p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple'>
            <div className='flex items-center justify-between'>
              <h1 className='font-semibold text-gray-600'>{event.title}</h1>
              <span className='text-gray-300 text-sm'>{event.time}</span>
            </div>
            <p className='mt-2 text-gray-400 text-sm'>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventCalendar
