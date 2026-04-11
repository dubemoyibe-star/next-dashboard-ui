"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useActionState, useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { TeacherInput, teacherSchema } from '@/lib/formValidationSchemas';
import { createTeacher, updateTeacher } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';


type TeacherFormProps = {
  type: "create" | "update",
  data?: any,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  relatedData?: any
}

const TeacherForm = ({type, data, setOpen ,relatedData}: TeacherFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),
  });

    const [img, setImg] = React.useState<any>()

    const [state, formAction] = useActionState(
      type === "create" ? createTeacher : updateTeacher, 
      {
        success: false,
        error: false
      })
  
  const onSubmit = handleSubmit(data => {
    console.log(data)
      startTransition(() => {
        const parsed = teacherSchema.parse({...data, img: img?.secure_url})
        formAction(parsed)
      })
    })
  
    const router = useRouter()
  
  
    useEffect(() => {
      if(state.success) {
        toast(`Teacher has been succesfully ${type === "create" ? "created" : "updated" }!`)
        router.refresh()
        setOpen(false)
      }
    }, [state, router, type, setOpen])
  
   const { subjects } = relatedData

  return (

      <div className='flex flex-col max-h-[90vh]'>
        <form className='flex-1 overflow-y-auto flex flex-col gap-8 px-6 py-4 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new teacher" : "Update the teacher"}</h1>
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
        <InputField 
          label="Blood Type" 
          name="bloodType" 
          defaultValue={data?.bloodType} 
          register={register} 
          error={errors?.bloodType}
        />
        <InputField 
          label="Birthday" 
          name="birthday" 
          type='date'
          defaultValue={data?.birthday.toISOString().split("T")[0]} 
          register={register} 
          error={errors?.birthday as FieldError | undefined}
        
        />

         <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500" htmlFor='sex'>Sex</label>

        <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
            {...register("sex")} 
            id='sex'
            defaultValue={data?.sex}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500" htmlFor='subjects'>Subjects</label>

        <div className="relative w-full">
            <select multiple className="cursor-pointer ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" 
            {...register("subjects")} 
            id='subjects'
            defaultValue={data?.subjects}>
              {subjects.map((subject: {id: string, name: string}) => (
                <option value={subject.id} key={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          {errors.subjects?.message && (
              <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
              </p>
            )}
        </div>

        <CldUploadWidget uploadPreset="school" onSuccess={(result, {widget}) => {
          setImg(result.info)
          widget.close()
        }}>
          {({ open }) => {
            return (
              <div 
              onClick={() => open()}
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              >
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
       {state.error && <span className='text-sm text-red-500 font-medium'>Something went wrong. Please try again.</span>}
      <button className='bg-blue-400 text-white p-2 rounded-md'>{type ==="create" ? "Create" : "Update" }</button>
    </form>

      </div>
  )
}

export default TeacherForm
