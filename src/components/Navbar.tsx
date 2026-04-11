import { prisma } from '@/lib/prisma';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

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
    <div className='flex items-center justify-between p-4'>
      {/*SEARCH BAR */}
      <div className='hidden text-xs md:flex md:ml-12 lg:ml-0 items-center gap-2  rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <label className='sr-only'>Search</label>
        <Image src="/search.png" alt='search' width={14} height={14}/>
        <input placeholder='Search...' className='w-[200px] p-2 bg-transparent outline-none'/>
      </div>

      {/*ICONS AND USER */}
      <div className='flex items-center gap-6 w-full justify-end'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt='message' width={20} height={20}/>
        </div>

       <Link href="/list/announcements">
        <div className='relative bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/announcement.png" alt='announcement' width={20} height={20}/>
          {count > 0 && <div className='rounded-full absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white bg-purple-500 text-xs'>
            {count}
          </div>}
        </div>
       </Link>

        <div className='flex flex-col'>
          <span className='text-xm leading-3 font-medium'>{user?.username}</span>
          <span className='text-[10px] text-gray-500 text-right'>
            {role}
          </span>
        </div>

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;