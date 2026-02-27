import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownWideNarrow, Plus, SlidersHorizontal } from 'lucide-react'
import { classesData, role} from '@/lib/data'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import TableSearch from '@/components/TableSearch'
import FormModal from '@/components/FormModal'

type Class = {
  id: number,
  name: string,
  capacity: number,
  grade: number,
  supervisor: string
}


const columns = [
  {
    header: 'Class Name', 
    accessor: 'name'
  },
  {
    header: 'Capacity', 
    accessor: 'capacity', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Grade', 
    accessor: 'grade', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Supervisor', 
    accessor: 'supervisor', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Actions', 
    accessor: 'actions', 
    
  },

]

const ClassListPage = () => {

    const renderRow = (item : Class) => {
    return <tr key={item.id} className=' border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors cursor-pointer'>
      <td className='flex items-center gap-4 p-4'>
       {item.name}
      </td>
      <td className='hidden md:table-cell'>{item.capacity }</td>
      <td className='hidden md:table-cell'>{item.grade}</td>
      <td className='hidden md:table-cell'>{item.supervisor}</td>
      <td>
        <div className='flex items-center gap-2'>
          {/* <Link href={`/list/student/${item.id}`}>
          <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky'>
            <Image src="/edit.png" alt="" width={16} height={16}/>
          </button>
          </Link> */}

          {role === "admin"  && (
          // <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple'>
          //   <Image src="/delete.png" alt="" width={16} height={16}/>
          // </button>
          <>
            <FormModal type="update" table="class" data={item}/>
            <FormModal type="delete" table="class" id={item.id}/>
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
        <h1 className='hidden md:block text-lg font-semibold'>All Classes</h1>
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <SlidersHorizontal className='w-4 h-4'/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <ArrowDownWideNarrow className='w-4 h-4'/>
            </button>
            {role === "admin" && 
            // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
            //   <Plus className='w-4 h-4'/>
            // </button>
            <FormModal type="create" table="class" />
            }
          </div>
        </div>
      </div>

      {/*LIST */}
      <Table columns={columns} renderRow={renderRow} data={classesData}/>

      {/*PAGINATION */}
      <Pagination />
    </div>
  )
}

export default ClassListPage
