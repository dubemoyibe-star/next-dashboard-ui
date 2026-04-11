import { prisma } from '@/lib/prisma';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const userId = user?.id;

  let count = 0;

  if (user) {
    const roleConditions = {
      teacher: {
        class: {
          lessons: {
            some: {
              teacherId: userId!,
            },
          },
        },
      },
      student: {
        class: {
          students: {
            some: {
              id: userId!,
            },
          },
        },
      },
      parent: {
        class: {
          students: {
            some: {
              parentId: userId!,
            },
          },
        },
      },
    };

    count = await prisma.announcement.count({
      where:
        role === 'admin'
          ? {} // admin sees all
          : {
              OR: [
                { classId: null }, // global announcements (IMPORTANT)
                roleConditions[role as keyof typeof roleConditions],
              ],
            },
    });
  }

  return (
    <div className='flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800'>
      {/*SEARCH BAR */}
      <div className='hidden text-xs md:flex md:ml-12 lg:ml-0 items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-700 px-2 bg-gray-50 dark:bg-gray-800'>
        <label className='sr-only'>Search</label>
        <Image src="/search.png" alt='search' width={14} height={14} className='dark:invert'/>
        <input placeholder='Search...' className='w-[200px] p-2 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'/>
      </div>

      {/*ICONS AND USER */}
      <div className='flex items-center gap-6 w-full justify-end'>
        <ThemeToggle />

       <Link href="/list/announcements">
       <div className='relative bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'>
          <Image src="/announcement.png" alt='announcement' width={20} height={20}/>
          {count > 0 && <div className='rounded-full absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white bg-purple-500 text-xs'>
            {count}
          </div>}
        </div>
       </Link>

        <div className='flex flex-col'>
          <span className='text-xm leading-3 font-medium text-gray-900 dark:text-gray-100'>{user?.username}</span>
          <span className='text-[10px] text-gray-500 dark:text-gray-400 text-right'>
            {role}
          </span>
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;