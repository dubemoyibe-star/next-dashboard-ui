import { ArrowDownWideNarrow, SlidersHorizontal } from 'lucide-react'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import TableSearch from '@/components/TableSearch'
import FormContainer from '@/components/FormContainer'
import { Parent, Prisma, Student } from '@/generated/prisma/client'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'

type ParentList = Parent & {students: Student[]}



const ParentsListPage = async ({
    searchParams
  }: {
    searchParams: {[key: string]: string} | undefined }
  ) => {
    const userRole = await role()
    const {page, ...queryParams} = await searchParams || {}
    const p = page ? parseInt(page) : 1

    //URL QUERY PARAMS

    const query : Prisma.ParentWhereInput = {}

    if(queryParams) {
      for(const [key, value] of Object.entries(queryParams)) {
        if(value !== undefined ) {
          switch(key) {
            case "search" :
              query.name = {
                contains: value,
                mode: "insensitive"
              }
              break;
              default:
                break
          }
        }     
      }
    }

    const [data, count] = await prisma.$transaction([
      prisma.parent.findMany({
        where: query,
        include: {
          students: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1)
      }),
      prisma.parent.count({
        where: query
      })
    ])

    // console.log(data)

    const columns = [
  {
    header: 'Info', 
    accessor: 'info'
  },
  {
    header: 'Student Names', 
    accessor: 'students', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Phone', 
    accessor: 'phone', 
  },
  {
    header: 'Address', 
    accessor: 'address', 
    className: 'hidden lg:table-cell'
  },
  ...(userRole === "admin" ? [{
    header: 'Actions', 
    accessor: 'actions', 
    
  }] : []),

]

const renderRow = (item : ParentList) => {
return <tr key={item.id} className=' border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 dark:even:bg-gray-800 text-sm hover:bg-lamaPurpleLight dark:hover:bg-gray-700 transition-colors cursor-pointer'>
  <td className='flex items-center gap-4 p-4'>
    <div className='flex flex-col'>
      <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{item.name}</h3>
      <p className='text-xs text-gray-500 dark:text-gray-400'>{item?.email}</p>
    </div>
  </td>
  <td className='hidden md:table-cell text-gray-600 dark:text-gray-300'>{item.students.map(student => student.name).join(", ")}</td>
  <td className='text-gray-600 dark:text-gray-300'>{item.phone}</td>
  <td className='hidden lg:table-cell text-gray-600 dark:text-gray-300'>{item.address}</td>
  <td>
    <div className='flex items-center gap-2'>
      

      {userRole === "admin"  && (
        <>
          <FormContainer type="update" table="parent" data={{...item, students: item.students.map((s: any) => s.id)}}/>
          <FormContainer type="delete" table="parent" id={item.id}/>
        </>
    )}
    </div>
  </td>
</tr>
}


  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-md flex-1 m-4 mt-0 dark:mt-1'> 
      {/*TOP */}
      <div className='flex items-center justify-between mb-6'>
        <h1 className='hidden md:block text-lg font-semibold text-gray-900 dark:text-gray-100'>All Parents</h1>
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <SlidersHorizontal className='w-4 h-4 text-gray-700 dark:text-gray-900'/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <ArrowDownWideNarrow className='w-4 h-4 text-gray-700 dark:text-gray-900'/>
            </button>
            {userRole === "admin" && 
              <FormContainer type="create" table="parent" />
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

export default ParentsListPage
