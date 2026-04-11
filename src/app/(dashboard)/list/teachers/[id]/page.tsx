import React from 'react'
import Image from 'next/image'
import { FaDroplet, } from 'react-icons/fa6'
import { Mail, Phone, Calendar } from 'lucide-react'
import BigCalendar from '@/components/BigCalendar'
import Announcements from '@/components/Announcements'
import Link from 'next/link'
import Performance from '@/components/Performance'
import { prisma } from '@/lib/prisma'
import { Teacher } from '@/generated/prisma/client'
import { notFound } from 'next/navigation'
import FormContainer from '@/components/FormContainer'
import { role } from '@/lib/utils'
import BigCalendarContainer from '@/components/BigCalendarContainer'

const SingleTeacherPage = async ({ params }: { params: { id: string } }) => {
  const userRole = await role()
  const id = (await params).id

  const teacher : (Teacher & {_count: { subjects: number, lessons: number, classes: number }}) | null  = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true
        }
      }
    }
  })

  if(!teacher) {
    return notFound()
  }
  return (
    <div className='flex-1 p-4 flex flex-col xl:flex-row gap-4'>
      {/*LEFT */}
      <div className='w-full xl:w-2/3'>
      {/*TOP */}
      <div className='flex flex-col lg:flex-row gap-4'>
        {/*USER INFO CARD */}
        <div className='bg-lamaSky dark:bg-gray-800 py-6 px-4 rounded-md flex-1 flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4'>
          <div className='w-full sm:w-1/3'>
          <Image src={teacher.img || "/noAvatar.png"} alt="" width={144} height={144} className='w-36 h-36 xl:w-28 xl:h-28 2xl:w-36 2xl:h-36 rounded-full object-cover'/>
        </div>
        <div className='w-2/3 flex flex-col justify-between gap-2'>
        <div className='flex items-center justify-between gap-4'>
           <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{teacher.name + " " + teacher.surname}</h1>
          {userRole === "admin" && (
              <FormContainer
           table='teacher' 
           type='update'
            data={teacher}
           />
           )}

        </div>
         
          <div className='flex items- justify-between gap-2 flex-wrap text-xs font-medium text-gray-700 dark:text-gray-300'>
            <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
              <FaDroplet className='text-red-500 w-5 h-5'/>
              <span>{teacher.bloodType}</span>
            </div>

            <div className='w-full md:w-1/3 flex lg:w-full 2xl:w-1/3 items-center gap-2'>
              <Calendar className='w-5 h-5 text-blue-700 '/>
              <span>{new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}</span>
            </div>

            <div className='w-full md:w-1/3 flex lg:w-full 2xl:w-1/3 items-center gap-2'>
              <Mail className='w-5 h-5 text-blue-700'/>
              <span>{teacher.email || "-"}</span>
            </div>

            <div className='w-full md:w-1/3 flex lg:w-full 2xl:w-1/3 items-center gap-2'>
              <Phone className='w-5 h-5 text-blue-700'/>
              <span>{teacher.phone || "-"}</span>
            </div>
          </div>
        </div>
        </div>
        
        {/*SMALL CARD */}
        <div className='flex flex-1 gap-4 justify-between flex-wrap'>
          {/*CARD */}
          <div className='w-full bg-white dark:bg-gray-800 p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full xl:w-[47.5%]  2xl:w-[48%] '>
            <Image src="/singleAttendance.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>90%</h1>
            <span className='text-sm text-gray-400 dark:text-gray-500'>Attendance</span>
          </div>
          </div>

          <div className='w-full bg-white dark:bg-gray-800 p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full   xl:w-[47.5%] 2xl:w-[48%] '>
            <Image src="/singleBranch.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{teacher._count.subjects}</h1>
            <span className='text-sm text-gray-400 dark:text-gray-500'>Branches</span>
          </div>
          </div>

          <div className='w-full bg-white dark:bg-gray-800 p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full  xl:w-[47.5%] 2xl:w-[48%] '>
            <Image src="/singleLesson.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{teacher._count.lessons}</h1>
            <span className='text-sm text-gray-400 dark:text-gray-500'>Lessons</span>
          </div>
          </div>

          <div className='w-full bg-white dark:bg-gray-800 p-4 rounded-md gap-4 md:w-[48.5%] lg:w-full xl:w-[47.5%] 2xl:w-[48%]  '>
            <Image src="/singleClass.png"
            alt="" 
            width={24} 
            height={24} 
            className='w-6 h-6' 
          />
          <div className=''>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{teacher._count.classes}</h1>
            <span className='text-sm text-gray-400 dark:text-gray-500'>Classes</span>
          </div>
          </div>
        </div>
      </div>

      {/*BOTTOM */}
        <div className='mt-4 bg-white dark:bg-gray-800 rounded-md p-4 h-[800px]'>
          <h1 className='text-gray-900 dark:text-gray-100'>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type='teacherId' id={teacher.id}/>
        </div>
      </div>

      {/*RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-4'>
        <div className='bg-white dark:bg-gray-800 p-4 rounded-md'>
          <h1 className='font-semibold text-xl text-gray-900 dark:text-gray-100'>Shortcuts</h1>
          <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500 dark:text-gray-400'>
            <Link href={`/list/classes?supervisorId=${"teacher2"}`} className='p-3 rounded-md bg-lamaSkyLight '>Teacher&apos;s Classes</Link>
            <Link href={`/list/students?teacherId=${"teacher2"}`} className='p-3 rounded-md bg-lamaPurpleLight '>Teacher&apos;s Students</Link>
            <Link href={`/list/lessons?teacherId=${"teacher2"}`} className='p-3 rounded-md bg-lamaYellowLight '>Teacher&apos;s Lessons</Link>
            <Link href={`/list/exams?teacherId=${"teacher2"}`} className='p-3 rounded-md bg-pink-50 '>Teacher&apos;s Exams</Link>
            <Link href={`/list/assignments?teacherId=${"teacher2"}`} className='p-3 rounded-md bg-lamaSkyLight '>Teacher&apos;s Assignments</Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  )
}

export default SingleTeacherPage
