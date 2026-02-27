import React from 'react'
import Image from 'next/image'

const TableSearch = () => {
  return (
   <div className='w-full md:w-auto text-xs flex items-center gap-2  rounded-full ring-[1.5px] ring-gray-300 px-2'>
     <label className='sr-only'>Search</label>
     <Image src="/search.png" alt='search' width={14} height={14}/>
     <input placeholder='Search...' className='w-[200px] p-2 bg-transparent outline-none'/>
    </div>
  )
}

export default TableSearch
