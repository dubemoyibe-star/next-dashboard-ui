import React from 'react'
import Image from 'next/image'
import { FaDroplet, } from 'react-icons/fa6'
import { Mail, Phone, Calendar } from 'lucide-react'
import BigCalendar from '@/components/BigCalendar'
import Announcements from '@/components/Announcements'
import Link from 'next/link'
import Performance from '@/components/Performance'

const SingleStudentPage = () => {
  return (
    <div className='flex-1 p-4 flex flex-col xl:flex-row gap-4'>
      {/*LEFT */}
      <div className='w-full xl:w-2/3'>
      {/*TOP */}
      <div className='flex flex-col lg:flex-row gap-4'>
        {/*USER INFO CARD */}
        <div className='bg-lamaSky py-6 px-4 rounded-md flex-1 flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4'>
          <div className='w-full sm:w-1/3'>
          <Image src="https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={144} height={144} className='w-36 h-36 xl:w-28 xl:h-28 2xl:w-36 2xl:h-36 rounded-full object-cover'/>
        </div>
        <div className='w-2/3 flex flex-col justify-between gap-2'>
          <h1 className='text-xl font-semibold'>Cameron Mayer</h1>
          <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quidem est pariatur dignissimos quam quod! </p>
          <div className='flex items- justify-between gap-2 flex-wrap text-xs font-medium '>
            <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
              <FaDroplet className='text-red-500 w-5 h-5'/>
              <span>A+</span>
            </div>

            <div className='w-full md:w-1/3 flex lg:w-full 2xl:w-1/3 items-center gap-2'>
              <Calendar className='w-5 h-5 text-blue-700 '/>
              <span>January 2025</span>
            </div>

            <div className='w-full md:w-1/3 flex lg:w-full 2xl:w-1/3 items-center gap-2'>
              <Mail className='w-5 h-5 text-blue-700'/>
              <span>user@gmail.com</span>
            </div>

            <div className='w-full md:w-1/3 flex lg:w-full 2xl:w-1/3 items-center gap-2'>
              <Phone className='w-5 h-5 text-blue-700'/>
              <span>+234 70 2613 7565</span>
            </div>
          </div>
        </div>
        </div>
        
        {/*SMALL CARD */}
        <div className='flex flex-1 gap-4 justify-between flex-wrap'>
          {/*CARD */}
          <div className='w-full bg-white p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full xl:w-[47.5%]  2xl:w-[48%] '>
            <Image src="/singleAttendance.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold'>90%</h1>
            <span className='text-sm text-gray-400'>Attendance</span>
          </div>
          </div>

          <div className='w-full bg-white p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full   xl:w-[47.5%] 2xl:w-[48%] '>
            <Image src="/singleBranch.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold'>6th</h1>
            <span className='text-sm text-gray-400'>Grade</span>
          </div>
          </div>

          <div className='w-full bg-white p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full  xl:w-[47.5%] 2xl:w-[48%] '>
            <Image src="/singleLesson.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold'>18</h1>
            <span className='text-sm text-gray-400'>Lessons</span>
          </div>
          </div>

          <div className='w-full bg-white p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full xl:w-[47.5%] 2xl:w-[48%]  '>
            <Image src="/singleClass.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold'>6A</h1>
            <span className='text-sm text-gray-400'>Class</span>
          </div>
          </div>
        </div>
      </div>

      {/*BOTTOM */}
        <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/*RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-4'>
        <div className='bg-white p-4 rounded-md'>
          <h1 className='font-semibold text-xl'>Shortcuts</h1>
          <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500'>
            <Link href="/" className='p-3 rounded-md bg-lamaSkyLight'>Student&apos;s Lessons</Link>
            <Link href="/" className='p-3 rounded-md bg-lamaPurpleLight'>Student&apos;s Teachers</Link>
            <Link href="/" className='p-3 rounded-md bg-pink-50'>Student&apos;s Exams</Link>
            <Link href="/" className='p-3 rounded-md bg-lamaSkyLight'>Student&apos;s Assignments</Link>
            <Link href="/" className='p-3 rounded-md bg-lamaYellowLight'>Student&apos;s Results</Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  )
}

export default SingleStudentPage
