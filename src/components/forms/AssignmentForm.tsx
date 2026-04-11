"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { AssignmentInput, assignmentSchema, ExamInput, examSchema } from '@/lib/formValidationSchemas';
import { createAssignment, createExam, updateAssignment, updateExam } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


type AssignmentFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const AssignmentForm = ({type, data, setOpen, relatedData}: AssignmentFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createAssignment : updateAssignment, 
    {
      success: false,
      error: false
    })

  const onSubmit = handleSubmit(data => {
    console.log(data)
    startTransition(() => {
      const parsed = assignmentSchema.parse(data)
      formAction(parsed)
    })
  })

  const router = useRouter()


  useEffect(() => {
    if(state.success) {
      toast(`Assignment has been succesfully ${type === "create" ? "created" : "updated" }!`)
      router.refresh()
      setOpen(false)
    }
  }, [state, type, router, setOpen])

 const { lessons } = relatedData

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new assignment" : "Update the assignment"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Assignment Title" 
          name="title" 
          defaultValue={data?.title} 
          register={register} 
          error={errors?.title}
        />
        <InputField 
          label="Start Date" 
          name="startDate" 
         defaultValue={
            data?.startDate
              ? new Date(data.startDate).toLocaleDateString("en-CA")
              : ""
          }
          register={register} 
          error={errors?.startDate as FieldError || undefined}
          type='date'
        />
        <InputField 
          label="Due Date" 
          name="dueDate" 
          defaultValue={
            data?.dueDate
              ? new Date(data.dueDate).toLocaleDateString("en-CA")
              : ""
          }
          register={register} 
          error={errors?.dueDate as FieldError || undefined}
          type='date'
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
      </div>

      <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500" htmlFor='lesson'>Lesson</label>
          <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
            {...register("lessonId")} 
            id='lesson'
            defaultValue={data?.teachers}>
              {lessons.map((lesson: { id: number, name: string }) => (
                <option value={lesson.id} key={lesson.id}>{lesson.name}</option>
              ))}
            </select>
          </div>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>

      {state.error && <span className='text-sm text-red-500 font-medium'>Something went wrong. Please try again.</span>}
      <button className='bg-blue-400 text-white p-2 rounded-md'>{type ==="create" ? "Create" : "Update" }</button>
    </form>
    </div>
  )
}

export default AssignmentForm
