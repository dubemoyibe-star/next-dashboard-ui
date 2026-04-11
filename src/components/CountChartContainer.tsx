import CountChart from './CountChart'
import { FaEllipsisH } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'

const CountChartContainer = async () => {
   
    const data = await prisma.student.groupBy({
      by: ['sex'],
      _count: true
    })
    
    const boys = data.find((d) => d.sex === "MALE")?._count || 0
    const girls = data.find((d) => d.sex === "FEMALE")?._count || 0
   return (
        <div className='bg-white dark:bg-gray-800 rounded-xl w-full h-full p-4'>
          {/* title */}
          <div className='flex items-center justify-between '>
            <h1 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Students</h1>
            <FaEllipsisH className='w-5 h-5 text-gray-500 dark:text-gray-400'/>
          </div>
          {/**chart */}
              <CountChart  boys={boys} girls={girls} />
            {/**bottom */}
            <div className='flex justify-center gap-16'>
              <div className='flex flex-col gap-1 items-center justify-center'>
                <div className='w-5 h-5 bg-lamaSky rounded-full'/>
                <h1 className='font-bold text-gray-900 dark:text-gray-100'>{boys}</h1>
                <h2 className='text-xs text-gray-400 dark:text-gray-500'>Boys ({ Math.round((boys / (boys + girls)) * 100)}%)</h2>
              </div>

              <div className='flex flex-col gap-1 items-center justify-center'>
                <div className='w-5 h-5 bg-lamaYellow rounded-full'/>
                <h1 className='font-bold text-gray-900 dark:text-gray-100'>{girls}</h1>
                <h2 className='text-xs text-gray-400 dark:text-gray-500'>Girls ({ Math.round((girls / (boys + girls)) * 100)}%)</h2>
              </div>
            </div>
          </div>
  )
}

export default CountChartContainer
