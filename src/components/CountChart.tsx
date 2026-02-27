"use client"

import { FaEllipsisH } from 'react-icons/fa';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Image from 'next/image';


const data = [
  {
    name: 'Total',
    count: 106,
    fill: 'white',
  },
  {
    name: 'Girls',
    count: 53,
    fill: '#FAE27C',
  },
  {
    name: 'Boys',
    count: 53,
    fill: '#83A6ED',
  },
];

const CountChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      {/* title */}
      <div className='flex items-center justify-between '>
        <h1 className='text-lg font-semibold'>Students</h1>
        <FaEllipsisH className='w-5 h-5 text-gray-500'/>
      </div>
      {/**chart */}
      <div className='relative w-full h-[75%]'>
      <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar
              background
              dataKey="count"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      <Image src="/maleFemale.png" alt="" width={55} height={55} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      {/**bottom */}
      <div className='flex justify-center gap-16'>
        <div className='flex flex-col gap-1 items-center justify-center'>
          <div className='w-5 h-5 bg-lamaSky rounded-full'/>
          <h1 className='font-bold'>1,234</h1>
          <h2 className='text-xs text-gray-300'>Boys (55%)</h2>
        </div>

        <div className='flex flex-col gap-1 items-center justify-center'>
          <div className='w-5 h-5 bg-lamaYellow rounded-full'/>
          <h1 className='font-bold'>1,234</h1>
          <h2 className='text-xs text-gray-300'>Boys (45%)</h2>
        </div>
      </div>
    </div>
  )
}

export default CountChart

