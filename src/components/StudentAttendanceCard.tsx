import { prisma } from '@/lib/prisma'
import React from 'react'

const StudentAttendanceCard = async ({ id } : { id : string}) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1)
      }
    }
  })

  const totalDays = attendance.length
  const presentDays = attendance.filter((day) => day.present).length
  const percentage = (presentDays / totalDays) * 100
  return (
    <div className=''>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{percentage || "-"}%</h1>
      <span className='text-sm text-gray-400 dark:text-gray-500'>Attendance</span>
    </div>
  )
}

export default StudentAttendanceCard
