"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useActionState, useEffect } from 'react'
import { FieldError, useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { StudentInput, studentSchema } from '@/lib/formValidationSchemas';
import { createStudent, updateStudent } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';


type StudentFormProps = {
  type: "create" | "update",
  data?: any,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  relatedData?: any
}

const StudentForm = ({type, data, setOpen ,relatedData}: StudentFormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
  });

    const [img, setImg] = React.useState<any>()

    const [state, formAction] = useActionState(
      type === "create" ? createStudent : updateStudent, 
      {
        success: false,
        error: false
      })
  
  const onSubmit = handleSubmit(data => {
    console.log(data)
      startTransition(() => {
        const parsed = studentSchema.parse({...data, img: img?.secure_url})
        formAction(parsed)
      })
    })
  
    const router = useRouter()
  
  
    useEffect(() => {
      if(state.success) {
        toast(`Student has been succesfully ${type === "create" ? "created" : "updated" }!`)
        router.refresh()
        setOpen(false)
      }
    }, [state, type, router, setOpen])
  
   const { grades, classes} = relatedData

   console.log(grades)
   console.log(classes)

  return (

      <div className='flex flex-col max-h-[90vh]'>
        <form className='flex-1 overflow-y-auto flex flex-col gap-8 px-6 py-4 sidebar-scroll' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{type === "create" ? "Create a new student" : "Update the student"}</h1>
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

        <InputField 
          label="Parent Id" 
          name="parentId" 
          defaultValue={data?.parentId} 
          register={register} 
          error={errors?.parentId}
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
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='sex'>Sex</label>

        <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
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
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='grade'>Grade</label>

        <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("gradeId")} 
            id='grade'
            defaultValue={data?.gradeId}>
              {grades?.map((grade: {id: string, level: number}) => (
                <option value={grade.id} key={grade.id}>{grade.level}</option>
              ))}
            </select>
          </div>
          {errors.gradeId?.message && (
              <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
              </p>
            )}
        </div>


                <div className="relative flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500 dark:text-gray-400" htmlFor='class'>Class</label>

        <div className="relative w-full">
            <select className="cursor-pointer ring-[1.5px] ring-gray-300 dark:ring-gray-600 p-2 rounded-md text-sm w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            {...register("classId")} 
            id='class'
            defaultValue={data?.classId}>
              {classes?.map((classItem: {id: number; name: string; capacity: number; _count: { students: number}}) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name} - {classItem._count.students + "/" + classItem.capacity}{" "} Capacity
                  </option>
              ))}
            </select>
          </div>
          {errors.classId?.message && (
              <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
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

export default StudentForm
