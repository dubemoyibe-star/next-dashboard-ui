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
   <form  className='w-full md:w-auto text-xs flex items-center gap-2  rounded-full ring-[1.5px] ring-gray-300 px-2'>
     <label className='sr-only'>Search</label>
     <Image src="/search.png" alt='search' width={14} height={14}/>
     <input onChange={handleChange} placeholder='Search...' className='w-[200px] p-2 bg-transparent outline-none'/>
    </form>
  )
}

export default TableSearch
