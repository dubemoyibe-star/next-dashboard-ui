import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import { prisma } from '@/lib/prisma'
import { currentUserId } from '@/lib/utils'

const ParentPage = async () => {

const userId = await currentUserId()

const students =  await prisma.student.findMany({
  where: {
    parentId: userId!
  }
})
  return (
    <div className='p-4 flex-1 flex gap-4 flex-col xl:flex-row'>
      {/*LEFT */}
     <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 w-full'>
        {students.map((student) => (
          <div key={student.id} className='w-full'>
            <div className='h-full bg-white p-4 rounded-md'>
              <h1 className='text-xl font-bold'>
                Schedule({student.name + " " + student.surname})
              </h1>
              <BigCalendarContainer type='classId' id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/*RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-8'>
        <Announcements />
      </div>
    </div>
  )
}

export default ParentPage
