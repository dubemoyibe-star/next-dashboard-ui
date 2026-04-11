import { ArrowDownWideNarrow, SlidersHorizontal } from 'lucide-react'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import TableSearch from '@/components/TableSearch'
import { prisma } from '@/lib/prisma'
import { Assignment, Class, Prisma, Subject, Teacher } from '@/generated/prisma/client'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { currentUserId, role } from '@/lib/utils'
import FormContainer from '@/components/FormContainer'

type AssignmentList = Assignment & { 
  lesson: { 
    subject: Subject,
    class: Class, 
    teacher: Teacher
  }
}


const AssignmentListPage = async ({
    searchParams
  }: {
    searchParams: {[key: string]: string} | undefined}
  ) => {

    const userRole = await role()
    const userId = await currentUserId()
    const {page, ...queryParams} = await searchParams || {}
    const p = page ? parseInt(page) : 1

    //URL QUERY PARAMS
    const query : Prisma.AssignmentWhereInput = {}

    query.lesson = {}

    if(queryParams) {
      for(const [key, value] of Object.entries(queryParams)) {
        if(value !== undefined) {
          switch(key) {
            case "classId" :
              query.lesson.classId = parseInt(value)
              break;
            case "teacherId" :
              query.lesson.teacherId = value
              break;
            case "search" :
              query.lesson.subject  = {
                  name: { contains: value, mode: "insensitive" }
              }
              break;
              default:
                break
          }
        }     
      }
    }

    //role conditions 
    switch (userRole) {
      case 'admin':
        break;
      case 'teacher':
        query.lesson.teacherId = userId!;
        break
      case 'student':
        query.lesson.class = {
          students: {
            some: {
              id: userId!
            }
          }
        }
        break
        case 'student':
        query.lesson.class = {
          students: {
            some: {
              parentId: userId!
            }
          }
        }
        break
      default:
        break;
    }

    const [data, count] = await prisma.$transaction([
      prisma.assignment.findMany({
        where: query,
        include: {
          lesson: {
            select: {
              subject: { select: {name: true} },
              class: { select: {name: true} },
              teacher: { select: {name: true, surname: true} }
            }
          }
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1)
      }),
      prisma.assignment.count({
        where: query
      })
    ])


    const columns = [
  {
    header: 'Subject Name', 
    accessor: 'name'
  },
  {
    header: 'Class', 
    accessor: 'class', 
  },
  {
    header: 'Title', 
    accessor: 'title', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Teacher', 
    accessor: 'teacher', 
    className: 'hidden md:table-cell'
  },
  {
    header: 'Due Date', 
    accessor: 'dueDate', 
    className: 'hidden md:table-cell'
  },
  ...(userRole === "admin" || userRole === "teacher" ? [
    {
      header: 'Actions', 
      accessor: 'actions', 
    }
  ]: []),
]

const renderRow = (item : AssignmentList) => {
return <tr key={item.id} className=' border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 dark:even:bg-gray-800 text-sm hover:bg-lamaPurpleLight dark:hover:bg-gray-700 transition-colors cursor-pointer'>
  <td className='flex items-center gap-4 p-4 text-gray-900 dark:text-gray-100'>
   {item.lesson.subject.name}
  </td>
  <td className='text-gray-600 dark:text-gray-300'>{item.lesson.class.name}</td>
  <td className='hidden md:table-cell text-gray-600 dark:text-gray-300'>{item.title}</td>
  <td className='hidden md:table-cell text-gray-600 dark:text-gray-300'>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
  <td className='hidden md:table-cell text-gray-600 dark:text-gray-300'>{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
  <td>
    <div className='flex items-center gap-2'>
      {(userRole === "admin" || userRole === "teacher") && (
      <>
        <FormContainer type="update" table="assignment" data={item}/>
        <FormContainer type="delete" table="assignment" id={item.id}/>
      </>
    )}
    </div>
  </td>
</tr>
}

  


  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-md flex-1 m-4 mt-0 dark:mt-1'>
      {/*TOP */}
      <div className='flex items-center justify-between mb-4'>
        <h1 className='hidden md:block text-lg font-semibold text-gray-900 dark:text-gray-100'>All Assignments</h1>
        <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <SlidersHorizontal className='w-4 h-4 text-gray-700 dark:text-gray-900'/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <ArrowDownWideNarrow className='w-4 h-4 text-gray-700 dark:text-gray-900'/>
            </button>
            {(userRole === "admin" || userRole === "teacher") && 
              <FormContainer type="create" table="assignment" />
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

export default AssignmentListPage
