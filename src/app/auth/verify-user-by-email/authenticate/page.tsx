// app/auth/callback/page.tsx
'use client';

import {  useReducer,  } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { isOnetimeTokenPurpose } from '../../../../server-action/backend/auth/util';
import { generateSecurityTokenByEmailVerificationAction } from '../../../../server-action/backend/auth/api';
import { isHttpException, isServerActionError } from '../../../../server-action/backend/common/util';
import { HttpStatus } from '../../../../server-action/backend/common/status';
import { ONE_TIME_TOKEN_PURPOSE } from '../../../../server-action/backend/auth/type';
import ErrorModal from '../../../../components/modal/ErrorModal';
import GuideModal from '../../../../components/modal/GuideModal';
import { AUTH_LOGIC_ROUTE } from '../../../../route/auth/route';

interface AuthenticateState {
  errorMessage : string;
  purpose : string;
  successMessage : string;

}

function isError(state : AuthenticateState) {
  return state.errorMessage.trim().length !== 0;
}

function isSuccess(state : AuthenticateState) {
  return state.successMessage.trim().length !== 0;
}

function isInit(state : AuthenticateState) {
  return !(isError(state) || isSuccess(state));
}

type Action =
  | { type: 'SUCCESS'; message: string }
  | { type: 'ERROR'; message: string }
  | { type : 'SET_PURPOSE'; purpose : string}
  ;

function reducer(state : AuthenticateState, action : Action) : AuthenticateState {
  switch(action.type){
    case 'SUCCESS':
      return {...state, successMessage : action.message, errorMessage : ''};
    case 'ERROR':
      return {...state, errorMessage : action.message, successMessage : ''};
    case 'SET_PURPOSE':
      return { ...state, purpose : action.purpose};
    default :
      return state;
  }
}


export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state ,dispatch ] = useReducer(reducer,{ errorMessage : '',
    purpose : '',
    successMessage : ''})
  const homeRoute = '/';

  const handleError = () => {
    router.push(homeRoute)
  }

  const handleSuccess = () => {
    switch(state.purpose){
      case ONE_TIME_TOKEN_PURPOSE.UPDATE_PASSWORD : 
          router.push(AUTH_LOGIC_ROUTE.UPDATE_PASSWORD);
          break;
      case ONE_TIME_TOKEN_PURPOSE.RECOVER_ACCOUNT :
      default :
          toast.error('sorry. not implement ');
      };
  }

  const handleVerify = async () => {

    const token = searchParams.get('token');
    const identifier = searchParams.get('identifier');
    const purpose = searchParams.get('purpose');

    if( !token ||!identifier ||!purpose
      ||!isOnetimeTokenPurpose(purpose)){
      toast.error('wrong access with wrong query' );
      return;
    }
    dispatch({type : 'SET_PURPOSE', purpose});
    const response = await generateSecurityTokenByEmailVerificationAction({ purpose  },token,identifier);

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
            dispatch({type : 'ERROR',message : errorMessage});
            return;
          default :
            dispatch({type : 'ERROR' , message :  `${response.statusCode}\n` + errorMessage });

        }
      }
      else{
        dispatch({type : 'SUCCESS' , message : `Success ${purpose}`});
      }
    }


  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Authenticating...</h1>
          <p className="text-gray-400">Please wait for second.</p>
      </div>
      {isInit(state) && <GuideModal message = {`Click Next button to authenticate`} onClickNext={handleVerify} />}
      {isSuccess(state) && <GuideModal message={state.successMessage} onClickNext={handleSuccess}  />}
      {isError(state) && <ErrorModal message={state.errorMessage} onClose={handleError}/>}
    </div>
  );
}
