import { Loader } from 'lucide-react'

const loading = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <Loader className=" text-gray-500 animate-spin" />Loading...
    </div>
  )
}

export default loading
