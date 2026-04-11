import { ArrowDownWideNarrow,  SlidersHorizontal } from 'lucide-react'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import TableSearch from '@/components/TableSearch'
import FormContainer from '@/components/FormContainer'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { Class, Event, Prisma } from '@/generated/prisma/client'
import { currentUserId, role } from '@/lib/utils'

type EventList = Event & {
  class: Class
}




const EventListPage = async ({
  searchParams
}: {
  searchParams: {[key: string]: string} | undefined}
) => {
  const userRole = await role()
  const userId = await currentUserId()
  const {page, ...queryParams} = await searchParams || {}
  const p = page ? parseInt(page) : 1

  //URL QUERY PARAMS

  const query : Prisma.EventWhereInput = {}

  if(queryParams) {
    for(const [key, value] of Object.entries(queryParams)) {
      if(value !== undefined ) {
        switch(key) {
          case "search" :
            query.title = {
              contains: value,
              mode: "insensitive"
            }
          break;
          default:
            break
      }     
    }
  }

  //role condition

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  }

  if(userRole !== "admin") {
    query.OR = [{classId: null}, {
      class: roleConditions[userRole as keyof typeof roleConditions] || {}
    }]
  }

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1)
    }),
    prisma.event.count({
      where: query
    })
  ])

  // console.log(data)
  const columns = [
  {
    header: 'Title', 
    accessor: 'title'
  },
  {
    header: 'Class', 
    accessor: 'class', 
  },
  {
    header: 'Date', 
    accessor: 'date', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Start Time', 
    accessor: 'startTime', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'End Time', 
    accessor: 'endTime', 
    className: 'hidden md:table-cell'
  },
  ...(userRole === "admin" ? [
    {
      header: 'Actions', 
      accessor: 'actions', 
    }
  ] : []),

]

const renderRow = (item : EventList) => {
return <tr key={item.id} className=' border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors cursor-pointer'>
  <td className='flex items-center gap-4 p-4'>
   {item.title}
  </td>
  <td>{item.class?.name || "-"}</td>
  <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
  <td className='hidden md:table-cell'>
      {item.startTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} 
  </td>
  <td className='hidden md:table-cell'>
    {item.endTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} 
  </td>
  <td>
    <div className='flex items-center gap-2'>
      {userRole === "admin"  && (
      <>
        <FormContainer type="update" table="event" data={item}/>
        <FormContainer type="delete" table="event" id={item.id}/>
      </>
      )}
    </div>
  </td>
</tr>
}


  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 '>
      {/*TOP */}
      <div className='flex items-center justify-between mb-4'>
        <h1 className='hidden md:block text-lg font-semibold'>All Events</h1>
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <SlidersHorizontal className='w-4 h-4'/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <ArrowDownWideNarrow className='w-4 h-4'/>
            </button>
            {userRole === "admin" && 
             <FormContainer type="create" table="event" />
            }
          </div>
        </div>
      </div>

      {/*LIST */}
      <Table columns={columns} renderRow={renderRow} data={data}/>

      {/*PAGINATION */}
      <Pagination page={p} count={count}/>
    </div>
  )
}
}

export default EventListPage
