"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { AnnouncementInput, announcementSchema, EventInput, eventSchema } from '@/lib/formValidationSchemas';
import { createAnnouncement, createEvent,  updateAnnouncement,  updateEvent } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify'; 
import { useRouter } from 'next/navigation';


type AnnouncementFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const AnnouncementForm = ({type, data, setOpen, relatedData}: AnnouncementFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createAnnouncement : updateAnnouncement, 
    {
      success: false,
      error: false
    })

  const onSubmit = handleSubmit(data => {
    console.log(data)
    startTransition(() => {
      const formattedData = {
        ...data,
        classId: data.classId ? Number(data.classId) : null,
      }
      const parsed = announcementSchema.parse(formattedData)
      formAction(parsed)
    })
  })

  const router = useRouter()


  useEffect(() => {
    if(state.success) {
      toast(`Announcement has been succesfully ${type === "create" ? "created" : "updated" }!`)
      router.refresh()
      setOpen(false)
    }
  }, [state, type, router, setOpen])

 const { classes } = relatedData

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new announcement" : "Update the announcement"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Announcement Title" 
          name="title" 
          defaultValue={data?.title} 
          register={register} 
          error={errors?.title}
        />
        <InputField 
          label="Date" 
          name="date" 
          defaultValue={
            data?.date
              ? new Date(data.date).toISOString().split("T")[0]
              : ""
          }
          register={register} 
          error={errors?.date as FieldError || undefined}
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

    <div className='flex justify-between gap-4 flex-wrap'>
      <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='lesson'>Lesson</label>
          <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("classId")} 
            id='class'
            defaultValue={data?.classId}>
              <option value="">All Classes (General)</option>
              {classes.map((classItem: { id: number, name: string }) => (
                <option value={classItem.id} key={classItem.id}>{classItem.name}</option>
              ))}
            </select>
          </div>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
        
        <InputField 
          label="Announcement Description" 
          name="description" 
          defaultValue={data?.description} 
          register={register} 
          error={errors?.description}
          type='text-area'
          textarea
        />
        </div>

      {state.error && <span className='text-sm text-red-500 font-medium'>Something went wrong. Please try again.</span>}
      <button className='bg-blue-400 text-white p-2 rounded-md'>{type ==="create" ? "Create" : "Update" }</button>
    </form>
    </div>
  )
}

export default AnnouncementForm
