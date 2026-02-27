import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownWideNarrow, Plus, SlidersHorizontal } from 'lucide-react'
import { role, subjectsData} from '@/lib/data'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import TableSearch from '@/components/TableSearch'
import FormModal from '@/components/FormModal'

type Subject = {
  id: number,
  name: string,
  teachers: string[]
}


const columns = [
  {
    header: 'Subject Name', 
    accessor: 'name'
  },
  {
    header: 'Teachers', 
    accessor: 'teachers', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Actions', 
    accessor: 'actions', 
    
  },

]

const SubjectsListPage = () => {

    const renderRow = (item : Subject) => {
    return <tr key={item.id} className=' border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-colors cursor-pointer'>
      <td className='flex items-center gap-4 p-4'>
        {item.name}
      </td>
      <td className='hidden md:table-cell'>
        {item.teachers.join(", ")}
      </td>
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
              <FormModal type="update" table="subject" data={item}/>
              <FormModal type="delete" table="subject" id={item.id}/>
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
        <h1 className='hidden md:block text-lg font-semibold'>All Subjects</h1>
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
            <FormModal type="create" table="subject" />
            }
          </div>
        </div>
      </div>

      {/*LIST */}
      <Table columns={columns} renderRow={renderRow} data={subjectsData}/>

      {/*PAGINATION */}
      <Pagination />
    </div>
  )
}

export default SubjectsListPage
