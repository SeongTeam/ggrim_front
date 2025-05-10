'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { isHttpException, isServerActionError } from '../../server-action/backend/util'
import { HttpStatus } from '../../server-action/backend/status'

interface EmailForm {
    emailFormAction : (email : string ) => Promise<any>
}

 const EmailForm = ({
    emailFormAction,
}: EmailForm) =>{
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await toast.promise(
        emailFormAction(email),
        {
         loading : `Verifying ...`,
        }
       )
       if(isServerActionError(response)){
           throw new Error(response.message);
       }
       else if(isHttpException(response)){
           const {statusCode } = response;
           const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
     
           switch(statusCode){
             case HttpStatus.FORBIDDEN :
             case HttpStatus.UNAUTHORIZED :
             case HttpStatus.BAD_REQUEST :
               toast.error(errorMessage);
               break;
             default : 
               throw new Error(`${response.statusCode}\n` + errorMessage);
           }
   
       }
       else{
           toast.success('success');
       }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-gray-800 text-white"
      />
      <button
        type="submit"
        className="w-full bg-red-600 text-white px-4 py-2 rounded font-semibold"
      >
        Send
      </button>
    </form>
  )
}

export default EmailForm;