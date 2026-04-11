"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useActionState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { ParentInput, parentSchema } from '@/lib/formValidationSchemas';
import { createParent, updateParent} from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


type ParentFormProps = {
  type: "create" | "update",
  data?: any,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  relatedData?: any
}

const ParentForm = ({type, data, setOpen ,relatedData}: ParentFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentInput>({
    resolver: zodResolver(parentSchema),
  });

    const [state, formAction] = useActionState(
      type === "create" ? createParent : updateParent, 
      {
        success: false,
        error: false
      })
  
  const onSubmit = handleSubmit(data => {
    console.log(data)
      startTransition(() => {
        const parsed = parentSchema.parse(data)
        formAction(parsed)
      })
    })
  
    const router = useRouter()
  
  
    useEffect(() => {
      if(state.success) {
        toast(`Parent has been succesfully ${type === "create" ? "created" : "updated" }!`)
        router.refresh()
        setOpen(false)
      }
    }, [state, router, type, setOpen])
  
   const { students } = relatedData

  return (

      <div className='flex flex-col max-h-[90vh]'>
        <form className='flex-1 overflow-y-auto flex flex-col gap-8 px-6 py-4 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new parent" : "Update the parent"}</h1>
      <span className='text-sm text-gray-400 font-medium'>Authentication Information</span>
      <div className='flex justify-between gap-4 flex-wrap'>
        <InputField 
          label="Username" 
          name="username" 
          defaultValue={data?.username} 
          register={register} 
          error={errors?.username}
        />

        <InputField 
          label="Email" 
          name="email" 
          defaultValue={data?.email} 
          register={register} 
          error={errors?.email}
        />

        <InputField 
          label="Password" 
          name="password" 
          type='password'
          defaultValue={data?.password} 
          register={register} 
          error={errors?.password}
        />
      </div>
      <span className='text-sm text-gray-400 font-medium'>Personal Information</span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField 
        label="First name" 
        name="name" 
        defaultValue={data?.name} 
        register={register} 
        error={errors?.name}
        />
        <InputField 
          label="Last Name" 
          name="surname" 
          defaultValue={data?.surname} 
          register={register} 
          error={errors?.surname}
        />
        <InputField 
          label="Phone" 
          name="phone" 
          type='phone'
          defaultValue={data?.phone} 
          register={register} 
          error={errors?.phone}
        />
        <InputField 
          label="Address" 
          name="address" 
          defaultValue={data?.address} 
          register={register} 
          error={errors?.address}
        />
        {data && (
                  <InputField 
                  label="id" 
                  name="id" 
                  defaultValue={data?.id} 
                  register={register} 
                  error={errors?.id}
                  hidden
                />
                )}

        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500" htmlFor='students'>Students</label>

        <div className="relative w-full">
            <select multiple className="cursor-pointer ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
            {...register("students")} 
            id='students'
            defaultValue={data?.students}>
              {students.map((student: {id: string, name: string, surname: string}) => (
                <option value={student.id} key={student.id}>{student.name + " " + student.surname}</option>
              ))}
            </select>
          </div>
          {errors.students?.message && (
              <p className="text-xs text-red-400">
              {errors.students.message.toString()}
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

export default ParentForm
