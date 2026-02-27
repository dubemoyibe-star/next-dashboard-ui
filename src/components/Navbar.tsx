import { Menu } from 'lucide-react';
import Image from 'next/image'
import React from 'react'

type NavbarProps = {
  toggleSidebar?: () => void;
};

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <div className='flex items-center justify-between p-4'>
      {toggleSidebar && (
        <button
          className="lg:hidden mx-2 p-2 text-gray-600"
          onClick={toggleSidebar}
        >
          <Menu className='w-5 h-5' />
        </button>
      )}

      {/*SEARCH BAR */}
      <div className='hidden text-xs md:flex items-center gap-2  rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <label className='sr-only'>Search</label>
        <Image src="/search.png" alt='search' width={14} height={14}/>
        <input placeholder='Search...' className='w-[200px] p-2 bg-transparent outline-none'/>
      </div>

      {/*ICONS AND USER */}
      <div className='flex items-center gap-6 w-full justify-end'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt='message' width={20} height={20}/>
        </div>
        <div className='relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/announcement.png" alt='message' width={20} height={20}/>
          <div className='rounded-full absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white bg-purple-500 text-xs'>1</div>
        </div>
        <div className='flex flex-col'>
          <span className='text-xm leading-3 font-medium'>John Doe</span>
          <span className='text-[10px] text-gray-500 text-right'>Admin</span>
        </div>
        <Image src="/avatar.png" alt='avatar' width={36} height={36} className='rounded-full'/>
      </div>
    </div>
  )
}

export default Navbar
