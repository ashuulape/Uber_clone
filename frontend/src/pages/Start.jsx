import React from 'react'
import { Link } from 'react-router-dom'
import Userlogin from './Userlogin'

const start = () => {
  return (
    <div className='flex w-full items-center justify-center bg-gradient-to-b from-[#4B88BE] to-[#6FAFDB]'>

    <div className='bg-[url(https://i.pinimg.com/736x/22/e9/a3/22e9a38fdab27d1bafac714dd9eee06c.jpg)] bg-center bg-cover h-screen min-w-[300px] w-full max-w-[750px] flex flex-col  justify-between '>
        <div className='flex justify-center'>
            <img className='invert h-30 ' src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800" alt="" />
            
        </div>
        <div className='bg-white px-10 py-5 h-[15%] flex flex-col gap-2'>
            <h2 className='font-bold text-xl text-center'>Get started With Uber</h2>
            <Link to='/login' className='bg-black w-full p-2 rounded  text-white text-center  '>continue</Link>
        </div>
        
    </div>  

    </div>
  )
}

export default start