import {useState} from 'react'
import API from '../api'

import {Link} from 'react-router-dom'

const SignUp = () => {
    const [name,setName]= useState('');
    const [email, setEmail]= useState('')
    const[password,setPassword]=useState('');
   

    const submit=async(e)=> {
        e.preventDefault();
        try{
            const res= await API.post('/api/auth/signup',{name,email,password});
            localStorage.setItem('token', res.data.token)
            window.location.href = "/todos";
        }
        catch(err){
            console.log(err.message);
            const resp=err?.response?.data?.message;
            if(resp.includes("already registered"))
                window.location.href = "/todos";
        }
    }
  return (
        <div className=' bg-gray-100 flex  flex-col items-center justify-center m-10 w-100 h-90 mx-auto my-40 rounded'>
      <form onSubmit={submit}>
      <input className='m-4 gap-2 flex flex-col bg-amber-400 p-2 rounded'  type='text' placeholder='name' value={name} onChange={(e)=>setName(e.target.value)} />
      <input className='m-4 gap-2 flex flex-col bg-amber-400 p-2 rounded'  type='email' placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className='m-4 gap-2 flex flex-col bg-amber-400 p-2 rounded'  type='password' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)} />

      <button className='m-4 gap-2 flex flex-col bg-blue-600  hover-bg-black-200 items-center justify-center mx-auto p-2 rounded' type='submit'>Signup</button>

      <Link to ='/login'><p className='m-4 gap-2 flex flex-col bg-blue-400 items-center justify-center mx-auto p-2 w-fit rounded'>Already registered ? Login</p></Link>
      </form>

      
      
    </div>
  )
}

export default SignUp
