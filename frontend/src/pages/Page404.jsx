import React from 'react'
import {useNavigate} from 'react-router-dom'

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center gap-2'>
      <h1 className='text-[4rem] font-bold'>Oops!</h1>
      <p className='text-lg'>404-PAGE NOT FOUND</p>
      <button onClick={()=> navigate('/')} className='px-6 py-2 bg-black text-white font-semibold rounded-md'>Home</button>
    </div>
  )
}

export default Page404