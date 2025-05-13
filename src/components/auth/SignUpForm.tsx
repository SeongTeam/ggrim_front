'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { signUpAction } from '../../server-action/backend/user/api'

import { isHttpException, isServerActionError } from '../../server-action/backend/util'
import { HttpStatus } from '../../server-action/backend/status'
import { useRouter } from 'next/navigation'
import GuideModal from '../GuideModal'
import ErrorModal from '../ErrorModal'
import { AUTH_LOGIC_ROUTE } from '../../app/auth/route'

interface SignUpState {
  username: string
  password: string
  passwordRepeat : string
  successMessage : string;
  errorMessage : string;
}

const initState = {
    username: '',
    password: '',
    passwordRepeat : '',
    successMessage: '',
    errorMessage : '',
    };

export default function SignUpForm() {

  const [form, setForm] = useState<SignUpState>(initState)
  const router = useRouter();

  const handleAuthError = () => {
    router.push(AUTH_LOGIC_ROUTE.VERIFY_EMAIL);
  }

  const handleSuccess = () => {
    router.push('/');
  }

  const handleChange = (field: keyof SignUpState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(form.password.trim() !== form.passwordRepeat.trim()){
        toast.error('password is not matched');
        return;
    }
    const toastId = toast.loading(`Signing Up`);

    const response = await signUpAction({ username : form.username, password : form.password.trim()});
    toast.dismiss(toastId);

    if(isServerActionError(response)){
        throw new Error(response.message);
    }
    else if(isHttpException(response)){
    const { message , statusCode } = response;
    const errorMessages : string[] = Array.isArray(message) ? message : [message];
    switch(statusCode){
        case HttpStatus.FORBIDDEN :
        case HttpStatus.BAD_REQUEST :
            errorMessages.forEach((msg) => toast.error(msg));
            break;
        case HttpStatus.UNAUTHORIZED :
            setForm({...initState , errorMessage : errorMessages.join('\n')});
            break;
        default : 
            throw new Error(`${response.statusCode}\n` + errorMessages.join('\n'));
        }

    }
    else if(response){
        setForm({...initState, successMessage : 'Success Sign Up'});
    }
    else{
        toast.error('invalid access');
      }

  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-lg w-96 shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>

      <div>
        <label className="block mb-1 text-sm">Username</label>
        <input
        type="text"
        value={form.username}
        onChange={handleChange('username')}
        className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        required
        />

      </div>

      <div>
        <label className="block mb-1 text-sm">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={handleChange('password')}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <label className="block mb-1 text-sm">Password Repeat</label>
        <input
          type="password"
          value={form.passwordRepeat}
          onChange={handleChange('passwordRepeat')}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
      >
        Sign Up
      </button>
      {form.successMessage && <GuideModal message={form.successMessage} onClickNext={handleSuccess} />}
      {form.errorMessage && <ErrorModal message={form.errorMessage} onClose={handleAuthError} />}

    </form>
  )
}
