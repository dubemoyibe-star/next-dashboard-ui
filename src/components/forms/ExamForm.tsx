"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { ExamInput, examSchema } from '@/lib/formValidationSchemas';
import { createExam, updateExam } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


type ExamFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const ExamForm = ({type, data, setOpen, relatedData}: ExamFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamInput>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createExam : updateExam, 
    {
      success: false,
      error: false
    })

  const onSubmit = handleSubmit(data => {
    console.log(data)
    startTransition(() => {
      const parsed = examSchema.parse(data)
      formAction(parsed)
    })
  })

  const router = useRouter()


  useEffect(() => {
    if(state.success) {
      toast(`Exam has been succesfully ${type === "create" ? "created" : "updated" }!`)
      router.refresh()
      setOpen(false)
    }
  }, [state, type, router, setOpen])

 const { lessons } = relatedData

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new exam" : "Update the exam"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Exam Title" 
          name="title" 
          defaultValue={data?.title} 
          register={register} 
          error={errors?.title}
        />
        <InputField 
          label="Start Date" 
          name="startTime" 
          defaultValue={data?.startTime
                      ? new Date(data.startTime).toISOString().slice(0, 16)
                      : ""
                  }
          register={register} 
          error={errors?.startTime as FieldError || undefined}
          type='datetime-local'
        />
        <InputField 
          label="End Date" 
          name="endTime" 
          defaultValue={data?.endTime
              ? new Date(data.endTime).toISOString().slice(0, 16)
              : ""
          }
          register={register} 
          error={errors?.endTime as FieldError || undefined}
          type='datetime-local'
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
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='lesson'>Lesson</label>
          <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
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

export default ExamForm
