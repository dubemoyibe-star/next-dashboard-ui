"use client"


import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TableSearch = () => {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = (e.target as HTMLInputElement).value
    const params = new URLSearchParams(window.location.search)
    params.set("search", value)
    router.push(`${window.location.pathname}?${params.toString()}`)
  }


  return (
   <form  className='w-full md:w-auto text-xs flex items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-600 px-2 py-2 bg-white dark:bg-gray-700'>
     <label className='sr-only'>Search</label>
     <Image src="/search.png" alt='search' width={14} height={14} className='dark:invert'/>
     <input onChange={handleChange} placeholder='Search...' className='w-[200px] p-0 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'/>
   </form>
  )
}

export default TableSearch
