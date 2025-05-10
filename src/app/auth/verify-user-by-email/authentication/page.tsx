// app/auth/callback/page.tsx
'use client';

import { useEffect, } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { isOnetimeTokenPurpose } from '../../../../server-action/backend/auth/util';
import { generateSecurityTokenByEmailVerificationAction } from '../../../../server-action/backend/auth/api';
import { isHttpException, isServerActionError } from '../../../../server-action/backend/util';
import { HttpStatus } from '../../../../server-action/backend/status';
import { OneTimeTokenPurposeValues } from '../../../../server-action/backend/auth/type';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const identifier = searchParams.get('identifier');
    const purpose = searchParams.get('purpose');

    if( !token ||!identifier ||!purpose
      ||!isOnetimeTokenPurpose(purpose)){
      toast.error('wrong access with wrong query');
      toast.error('please try again.');
      router.push('/auth/verify-user-by-email');
      return;
    }


    const verify = async () => {
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
              toast.error(errorMessage,{})
              return;
            default : 
              throw new Error(`${response.statusCode}\n` + errorMessage);
          }
        }
    
        switch(purpose){
          case OneTimeTokenPurposeValues.UPDATE_PASSWORD : 
              router.push('/auth/update-password');
              break;
          case OneTimeTokenPurposeValues.RECOVER_ACCOUNT :
          default :
              toast.error('sorry. not implement ');
            };
          }
    verify();
  }, [searchParams, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Authenticating...</h1>
          <p className="text-gray-400">Please wait for second.</p>
      </div>
    </div>
  );
}
