"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { ResultInput, resultSchema } from '@/lib/formValidationSchemas';
import {  createResult, updateResult } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


type ResultFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const ResultForm = ({type, data, setOpen, relatedData}: ResultFormProps) => {

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultInput>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createResult : updateResult, 
    {
      success: false,
      error: false
    })

  const onSubmit = handleSubmit(data => {
    if (!data.examId) data.examId = null;
    if (!data.assignmentId) data.assignmentId = null;
    console.log(data)
    startTransition(() => {
      const parsed = resultSchema.parse(data)
      formAction(parsed)
    })
  })

  const router = useRouter()


  useEffect(() => {
    if(state.success) {
      toast(`Result has been succesfully ${type === "create" ? "created" : "updated" }!`)
      router.refresh()
      setOpen(false)
    }
  }, [state, type, router, setOpen])

  

 const { exams, assignments, students } = relatedData
 const examId = watch("examId");
 const assignmentId = watch("assignmentId");

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new result" : "Update the result"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Exam Score" 
          name="score" 
          defaultValue={data?.score} 
          register={register} 
          error={errors?.score as FieldError || undefined}
        />
        {data && (
          <InputField 
          label="id" 
          name="id" 
          defaultValue={data?.id} 
          register={register} 
          error={errors?.id as FieldError | undefined}
          hidden
        />
        )}

        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='exam'>Exam</label>
          <div className="relative w-full">
            <select disabled={type === "create" && !!assignmentId && !examId} className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("examId")} 
            id='exam'
            defaultValue={data?.examId ?? ""}>
              <option disabled value="" >Select an exam</option>
              {exams.map((exam: { id: number, title: string }) => (
                <option value={exam.id} key={exam.id}>{exam.title}</option>
              ))}
            </select>
          </div>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>
      </div>


        <div className='flex justify-between gap-4 flex-wrap '>
        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='assignment'>Assignment</label>
          <div className="relative w-full">
            <select  disabled={type === "create" &&!!examId && !assignmentId} className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("assignmentId")} 
            id='assignment'
            defaultValue={data?.assignmentId ?? ""}>
              <option disabled value="" >Select an assignment</option>
              {assignments.map((assignment: { id: number, title: string }) => (
                <option value={assignment.id} key={assignment.id}>{assignment.title}</option>
              ))}
            </select>
          </div>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message.toString()}
            </p>
          )}
        </div>

              <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='student'>Student</label>
          <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("studentId")} 
            id='student'
            defaultValue={data?.studentId ?? ""}>
              <option disabled value="" >Select a student</option>
              {students.map((student: { id: number, name: string, surname: string }) => (
                <option value={student.id} key={student.id}>{student.name + " " + student.surname}</option>
              ))}
            </select>
          </div>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>
        </div>



      {state.error && <span className='text-sm text-red-500 font-medium'>Something went wrong. Please try again.</span>}
      <button className='bg-blue-400 text-white p-2 rounded-md'>{type ==="create" ? "Create" : "Update" }</button>
    </form>
    </div>
  )
}

export default ResultForm
