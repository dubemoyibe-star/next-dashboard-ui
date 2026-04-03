import { prisma } from '@/lib/prisma'
import { FaEllipsisH } from 'react-icons/fa'


const UserCard = async ({type} : {type: "admin" | "teacher" | "student" | "parent" }) => {

  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent
  }

  const data = await modelMap[type].count()

  return (
    <div className='rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]'>
      <div className='flex justify-between items-center'>
        <span className='text-[10px] bg-white px-2 py-1 rounded-full text-green-600'>2025/26</span>
        <FaEllipsisH className='cursor-pointer text-white'/>
      </div>
      <h1 className='text-2xl font-semibold my-4'>{data}</h1>
      <h1 className='capitalize text-sm font-medium text-gray-500'>{type}<span className='lowercase'>s</span></h1>
    </div>
  )
}

export default UserCard
