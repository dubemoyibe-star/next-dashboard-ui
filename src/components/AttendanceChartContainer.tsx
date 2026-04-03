import { FaEllipsisH } from 'react-icons/fa'
import AttendanceChart from './AttendanceChart'
import { prisma } from '@/lib/prisma'

const AttendanceChartContainer = async () => {

  const today = new Date()
  const dayOfWeek = today.getDay() 
  const daySinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const lastMonday = new Date(today)
  lastMonday.setDate(today.getDate() - daySinceMonday)  

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      }
    },
    select: {
      date: true,
      present: true
    }
  })
  // console.log(data)

  const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri" ]

  const attendanceMap : { [key : string] : { present: number, absent: number }} = {
    Mon: { present: 0, absent: 0 },
    Tue: { present: 0, absent: 0 },
    Wed: { present: 0, absent: 0 },
    Thu: { present: 0, absent: 0 },
    Fri: { present: 0, absent: 0 },
  }

  resData.forEach((item) => {
    const itemDate = new Date(item.date)

    if(dayOfWeek === 1 && dayOfWeek <= 5) {
      const dayName = daysOfTheWeek[dayOfWeek - 1]

      if(item.present) {
        attendanceMap[dayName].present += 1
      }else {
        attendanceMap[dayName].absent += 1
      }
    }
  })

  const data = daysOfTheWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent
  }))
  
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>
          Attendance
        </h1>
        <FaEllipsisH className='w-5 h-5 text-gray-500'/>
      </div>
      <AttendanceChart data={data}/>
    </div>
  )
}

export default AttendanceChartContainer
