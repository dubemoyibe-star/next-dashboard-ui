"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { ClassInput, classSchema } from '@/lib/formValidationSchemas';
import { createClass, updateClass } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


type ClassFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const ClassForm = ({type, data, setOpen, relatedData}: ClassFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassInput>({
    resolver: zodResolver(classSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createClass : updateClass, 
    {
      success: false,
      error: false
    })

  const onSubmit = handleSubmit(data => {
    console.log(data)
    const parsed = classSchema.parse(data)
    startTransition(() => {
      formAction(parsed)
    })
  })

  const router = useRouter()


  useEffect(() => {
    if(state.success) {
      toast(`Subject has been succesfully ${type === "create" ? "created" : "updated" }!`)
      router.refresh()
      setOpen(false)
    }
  }, [state, router, type, setOpen ])

 const { teachers, grades } = relatedData

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new class" : "Update the class"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Class name" 
          name="name" 
          defaultValue={data?.name} 
          register={register} 
          error={errors?.name}
        />

        <InputField 
          label="Capacity" 
          name="capacity" 
          defaultValue={data?.capacity} 
          register={register} 
          error={errors?.capacity as FieldError | undefined}
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
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='supervisor'>Supervisor</label>

        <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("supervisorId")} 
            id='supervisor'
            defaultValue={data?.teachers}>
              {teachers.map((teacher: {id: string, name: string, surname: string}) => (
                <option 
                defaultValue={ data && data?.supervisorId === teacher.id}
                value={teacher.id} 
                key={teacher.id}>{teacher.name + " " + teacher.surname}</option>
              ))}
            </select>
          </div>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>

        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='grade'>Grade</label>

        <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("gradeId")} 
            id='grade'
            defaultValue={data?.gradeId}>
              {grades.map((grade: {id: number, level: number }) => (
                <option 
                defaultValue={ data && data?.gradeId === grade.id}
                value={grade.id} 
                key={grade.id}
                >
                  {grade.level}
                </option>
              ))}
            </select>
          </div>
          {errors.gradeId?.message && (
              <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
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

export default ClassForm
