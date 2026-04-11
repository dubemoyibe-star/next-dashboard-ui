"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { ClassInput, classSchema, LessonInput, lessonSchema, SubjectInput, subjectSchema } from '@/lib/formValidationSchemas';
import { createClass, createLesson, createSubject, updateClass, updateLesson, updateSubject } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


type LessonFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const LessonForm = ({type, data, setOpen, relatedData}: LessonFormProps) => {
  console.log("LessonForm received:", { type, data })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createLesson : updateLesson, 
    {
      success: false,
      error: false
    })

 const onSubmit = handleSubmit(data => {
  console.log("Form data:", data)
  try {
    const parsed = lessonSchema.parse(data)
    console.log("Parsed data:", parsed)
    startTransition(() => {
      console.log("3. Calling formAction") 
      formAction(parsed)
    })
  } catch (err) {
    console.error("Validation error:", err)
  }
})
  const router = useRouter()


  useEffect(() => {
    if(state.success) {
      toast(`Lesson has been succesfully ${type === "create" ? "created" : "updated" }!`)
      router.refresh()
      setOpen(false)
    }
    if(state.error){
      toast("Something went wrong, please try again!")
    }
  }, [state, router, type, setOpen ])

 const { teachers, classes, subjects } = relatedData

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new lesson" : "Update the lesson"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Lesson name" 
          name="name" 
          defaultValue={data?.name} 
          register={register} 
          error={errors?.name}
        />
        <InputField 
            label="Start Time" 
            name="startTime" 
            defaultValue={data?.startTime
              ? new Date(data.startTime).toISOString().slice(0, 16)
              : ""}
            register={register} 
            error={errors?.startTime as FieldError || undefined}
            type='datetime-local'
          />

          <InputField 
            label="End Time" 
            name="endTime" 
            defaultValue={data?.endTime
                ? new Date(data.endTime).toISOString().slice(0, 16)
                : ""}
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
      <div className='flex justify-between flex-wrap gap-4'>

      <div className="relative flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor="teacherId">Teacher</label>
          <select
            id="teacherId"
            {...register("teacherId")}
             defaultValue={type === "update" ? data?.teacherId : ""}
            className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="" disabled>Select a teacher</option>
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <option
                key={teacher.id}
                value={teacher.id}
              >
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacherId && (
            <p className="text-xs text-red-400">{errors.teacherId.message}</p>
          )}
        </div>

        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor="classId">Class</label>
          <select
            id="classId"
            {...register("classId")}
             defaultValue={type === "update" ? data?.classId : ""}
            className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="" disabled>Select a class</option>
            {classes.map((classItem: { id: number; name: string }) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>

        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor="subjectId">Subject</label>
      <select
        id="subjectId"
        {...register("subjectId")}
         defaultValue={type === "update" ? data?.subjectId : ""}
        className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="" disabled>Select a subject</option>
        {subjects.map((subject: { id: number; name: string }) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
      {errors.subjectId && (
        <p className="text-xs text-red-400">{errors.subjectId.message}</p>
      )}
    </div>

    <div className="relative flex flex-col gap-2 w-full md:w-1/4">
    <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor="day">Day</label>
    <select
      id="day"
      {...register("day")}
       defaultValue={type === "update" ? data?.day : ""}
      className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    >
      <option value="" disabled>Select a day</option>
      <option value="MONDAY">Monday</option>
      <option value="TUESDAY">Tuesday</option>
      <option value="WEDNESDAY">Wednesday</option>
      <option value="THURSDAY">Thursday</option>
      <option value="FRIDAY">Friday</option>
    </select>
    {errors.day && (
      <p className="text-xs text-red-400">{errors.day.message}</p>
    )}
  </div>


    </div>
      {state.error && <span className='text-sm text-red-500 font-medium'>Something went wrong. Please try again.</span>}
      <button className='bg-blue-400 text-white p-2 rounded-md'>{type ==="create" ? "Create" : "Update" }</button>
    </form>
    </div>
  )
}

export default LessonForm
