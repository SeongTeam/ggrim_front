'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { isHttpException, isServerActionError } from '../../server-action/backend/util'
import { HttpStatus } from '../../server-action/backend/status'
import { HttpException, ServerActionError } from '../../server-action/backend/dto'
import { useRouter } from 'next/navigation'
import GuideModal from '../modal/GuideModal'


interface UsernameFormProps { 
  NextRoute : string;
  submitHandler : (username : string) => Promise<ServerActionError|HttpException|boolean>
  initialValue? : string;
}

const UpdateUsernameForm = ({
  NextRoute,
  submitHandler,
  initialValue
} : UsernameFormProps) =>{
  const [username, setUsername] = useState(initialValue||'')
  const [success , setSuccess] = useState('');
  const router = useRouter();

  const successHandler = () => {
    router.push(NextRoute);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(initialValue?.trim() && initialValue === username){
      toast.error('username is not changed');
      return;
    }

    const response = await toast.promise(
      submitHandler(username),
        {
         loading : `Verifying ...`,
        }
       )
       if(isServerActionError(response)){
           throw new Error(response.message);
       }
       else if(isHttpException(response)){
           const {statusCode } = response;
           const {message} = response;
     
           switch(statusCode){
             case HttpStatus.FORBIDDEN :
             case HttpStatus.UNAUTHORIZED :
             case HttpStatus.BAD_REQUEST :
               if(Array.isArray(message)){
                message.forEach((m) => toast.error(m));
               }
               else{
                toast.error(message);
               }
               break;
             default : 
               const errorMessage = Array.isArray(message) ? message.join('\n') : message;
               throw new Error(`${response.statusCode}\n` + errorMessage);
           }
   
       }
       else if(response === true) {
           setSuccess('success task');
           router.refresh();
          //  router.push(NextRoute);
       }
       else{
        toast.error('invalid access');
       }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          Submit
        </button>
      </form>
      {success&& <GuideModal message={success} onClickNext={successHandler} />}
    </>
  )
}

export default UpdateUsernameForm;