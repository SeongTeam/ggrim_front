// components/PostMenu.tsx
'use client'

import {  MoreVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Quiz } from '../../model/interface/quiz'
import { useRouter } from 'next/navigation'
import { deleteQuizReactionAction } from '../../server-action/backend/quiz/api'
import { isHttpException, isServerActionError } from '../../server-action/backend/util'
import { HttpStatus } from '../../server-action/backend/status'
import toast from 'react-hot-toast'
import GuideModal from '../GuideModal'

type QuizMenuProps = {
  quiz : Quiz
  isOwner: boolean

}

export default function QuizMenu({
    quiz,
  isOwner,
}: QuizMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter();
  const [success, setSuccess ] = useState('');
  const [isShow, setIsShow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const onEdit = () => {
    router.push(`/quiz/${quiz.id}/edit`);
  }
  const handleSuccess = () => {
    router.push(`/`);
  }

  const onDescription =() => {
    setIsShow(true);
  }

  const onDelete = async () => {
    const response = await deleteQuizReactionAction(quiz.id);

    if(isServerActionError(response)){
        throw new Error(response.message);
    }
    else if(isHttpException(response)){
        const { statusCode } = response;
        const messages : string [] = Array.isArray(response.message) ? response.message : [ response.message];
        
        switch(statusCode){
            case HttpStatus.BAD_REQUEST:
            case HttpStatus.FORBIDDEN:
            case HttpStatus.UNAUTHORIZED:
                messages.forEach(m=>toast.error(m));
                break;
            default : 
                throw new Error(messages.join('\n'));
        }
    }
    else{
        setSuccess('Success Delete');
    }
  }



  return (
    <>
        { success && <GuideModal message={success} onClickNext={handleSuccess} />}
        <div className="relative inline-block text-left" ref={menuRef}>
        
        <button
            onClick={() => setOpen(!open)}
            className="flex p-2 flex-row rounded-md border bg-black text-white border-black hover:bg-gray-600 "
            aria-label="Menu"
        >
            <p className="hidden md:block">MENU</p>
            <MoreVertical />
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-40 bg-black border border-black rounded-md shadow-lg z-10">
            <button
                onClick={() => {
                onDescription()
                setOpen(false)
                }}
                className="w-full text-left text-white px-4 py-2 hover:bg-gray-600"
            >
                Description
            </button>

            {isOwner && (
                <>
                <button
                    onClick={() => {
                    onEdit()
                    setOpen(false)
                    }}
                    className="w-full text-left text-white px-4 py-2 hover:bg-gray-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => {
                    onDelete()
                    setOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-600"
                >
                    Delete
                </button>
                </>
            )}
            </div>
        )}
        </div>
    </>
  )
}
