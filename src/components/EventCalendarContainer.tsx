import EventList from './EventList'
import EventCalendar from './EventCalendar'
import { FaEllipsisH } from 'react-icons/fa'

const EventCalendarContainer = async (
  { searchParams } : { searchParams : {[keys: string] : string | undefined}}
 ) => {

  const { date } = await searchParams
  return (
        <div className='bg-white dark:bg-gray-800 p-4 rounded-lg'>
          <EventCalendar  />
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold my-4 text-gray-900 dark:text-gray-100'>Events</h1>
            <FaEllipsisH className='w-5 h-5 text-gray-500 dark:text-gray-400'/>
          </div>
          <div className='flex flex-col gap-4'>
            <EventList dateParam={date} />
          </div>
        </div>
  )
}

export default EventCalendarContainer
