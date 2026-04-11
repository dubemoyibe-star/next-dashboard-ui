"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import { SubjectInput, subjectSchema } from '@/lib/formValidationSchemas';
import { createSubject, updateSubject } from '@/lib/actions';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


type SubjectFormProps = {
  type: "create" | "update",
  data?: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  relatedData?: any
}

const SubjectForm = ({type, data, setOpen, relatedData}: SubjectFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectInput>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createSubject : updateSubject, 
    {
      success: false,
      error: false
    })

  const onSubmit = handleSubmit(data => {
    console.log(data)
    startTransition(() => {
      const parsed = subjectSchema.parse(data)
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
  }, [state, router, type, setOpen])

 const { teachers } = relatedData

  return (
    <div className=' flex flex-col max-h-[90vh]'>
      <form className='flex flex-1 overflow-y-auto flex-col gap-8 px-6 py-3 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new subject" : "Update the subject"}</h1>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Subject name" 
          name="name" 
          defaultValue={data?.name} 
          register={register} 
          error={errors?.name}
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
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='teachers'>Teachers</label>

        <div className="relative w-full">
            <select className="sidebar-scroll cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            multiple
            {...register("teachers")} 
            id='teachers'
            defaultValue={data?.teachers}>
              {teachers.map((teacher: {id: string, name: string, surname: string}) => (
                <option value={teacher.id} key={teacher.id}>{teacher.name + " " + teacher.surname}</option>
              ))}
            </select>
          </div>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
            </p>
          )}
        </div>

      {state.error && <span className='text-sm text-red-500 font-medium'>Something went wrong. Please try again.</span>}
      <button className='bg-blue-400 text-white p-2 rounded-md'>{type ==="create" ? "Create" : "Update" }</button>
    </form>
    </div>
  )
}

export default SubjectForm
