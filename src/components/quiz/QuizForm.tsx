'use client'
import {  FormEvent,  useCallback,  useEffect, useReducer,  useState } from "react";
import { Painting } from "../../model/interface/painting";
import { Card } from "../Card";
import { useRouter } from "next/navigation";
import AlertModal from "../modal/AlertModal";
import { InsertToggleInput } from "../InsertToggleInput";
import Loading from "../Loading";
import { CheckCircle, XCircle } from "lucide-react";
import { getPaintingAction } from "../../server-action/backend/painting/api";
import { isHttpException, isServerActionError } from "../../server-action/backend/util";
import { CreateQuizDTO } from "../../server-action/backend/quiz/dto";
import { addQuizAction, updateQuizAction } from "../../server-action/backend/quiz/api";
import { Quiz } from "../../model/interface/quiz";
import { getSavedNewQuiz, removeSavedNewQuiz, saveNewQuiz } from "../../storage/local/quiz";
import { useDebounceCallback } from "../../hooks/optimization";

export interface NewQuiz{
  answer :Painting|undefined;
  distractor1 : Painting|undefined
  distractor2 : Painting|undefined
  distractor3 : Painting|undefined;
  title : string;
  timeLimit: number;
  description : string;
  type: 'ONE_CHOICE';

}
type StatePaintingKey = 'answer'|'distractor1'|'distractor2'|'distractor3';
type PaintingActionType = 'SET_ANSWER'|'SET_DISTRACTOR1'|'SET_DISTRACTOR2'|'SET_DISTRACTOR3';
type PaintingAction = { type: PaintingActionType; painting: Painting|undefined }


type Action =
| { type: 'SET_TITLE'; title : string}
| { type: 'SET_DESCRIPTION'; description : string}
| { type: 'SET_ALL', newQuiz : NewQuiz }
| PaintingAction
;

function reducer(state : NewQuiz, action : Action) : NewQuiz {
switch(action.type){
  case 'SET_TITLE':
    return {...state, title : action.title};
  case 'SET_DESCRIPTION':
    return {...state, description : action.description };
  case 'SET_ANSWER':
    return {...state, answer : action.painting };
  case 'SET_DISTRACTOR1':
    return {...state, distractor1 : action.painting };
  case 'SET_DISTRACTOR2' :
    return {...state, distractor2 : action.painting };
  case 'SET_DISTRACTOR3' :
    return {...state, distractor3 : action.painting };
  case 'SET_ALL' : 
    return { ... action.newQuiz };
  default :
    return state;
}
}


// TODO: QuizForm() 개선
// - [x] : 그림 보여주기 영역 디버깅
// - [x] : 폼 디자인 꾸미기
// - [ ] : detail Painting Modal에서 Painting ID 바로 볼수 있게 명시하기
// - [x] : 브라우저 캐시에 form context 저장하는 로직 추가
// - [x] : 브라우저 캐시에서 form context 가져오는 로직 추가
//  -> 사용자가 painting id를 검색하러 페이지를 옮길 수 있으므로, 현재 컨텍스트를 따로 보관해야함
// - [x] : title,description, input 크기 제한하기
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>



interface QuizFormProps {
  quiz? : Quiz
}

const initState : NewQuiz = {
    answer : undefined,
    distractor1 : undefined,
    distractor2 : undefined,
    distractor3 : undefined,
    title : '',
    description : '',
    type: 'ONE_CHOICE',
    timeLimit : 30,
    
}

const initializeState = (quiz? : Quiz) : NewQuiz =>{
 
  if(!quiz){
    return initState;
  }

  return {
    answer : quiz.answer_paintings[0],
    distractor1 : quiz.distractor_paintings[0],
    distractor2 : quiz.distractor_paintings[1],
    distractor3 : quiz.distractor_paintings[2],
    title : quiz.title,
    description : quiz.description,
    type : 'ONE_CHOICE',
    timeLimit : quiz.time_limit,

  }

}

const isDuplicatedPaintingPainting = (state : NewQuiz, painting : Painting) => {
  const keys : StatePaintingKey[] = ['answer','distractor1','distractor2','distractor3'];
  const paintings :Painting[] = [];
  keys.forEach(key=> state[key] ? paintings.push(state[key]) : key);

  return paintings.some(p=>painting.id === p.id);
}





export default function QuizForm({ quiz } : QuizFormProps) : JSX.Element {
    const [newQuiz,dispatch] = useReducer(reducer,quiz, initializeState);
    const [error,setError] = useState("");
    const router = useRouter();
    const distractorKeys : StatePaintingKey[] = ['distractor1','distractor2','distractor3'];


  function mapPaintingKeyToAction(key : StatePaintingKey,painting : Painting|undefined) {

    switch(key){
      case 'answer' :
        return dispatch({type: 'SET_ANSWER', painting});
      case "distractor1":
        return dispatch({type: 'SET_DISTRACTOR1', painting});
      case "distractor2":
        return dispatch({type: 'SET_DISTRACTOR2', painting});
      case "distractor3":
        return dispatch({type: 'SET_DISTRACTOR3', painting});
      default :
        setError('wrong handler run');
        return;

    }

  }

  const callServerAction = async (dto : CreateQuizDTO, quiz : Quiz|undefined) =>{

    const serverAction = quiz === undefined ? addQuizAction : ( dto : CreateQuizDTO ) => updateQuizAction(quiz.id,dto);
    


    const response  = await serverAction(dto);

    if(isServerActionError(response)){
      throw new Error(response.message);
    }
    else if(isHttpException(response)){
        const errorMessage = Array.isArray(response.message) ? response.message.join('\n') : response.message;
        setError(errorMessage+'\n'+'please try later');
        return;
    }
    else{
      removeSavedNewQuiz();
      router.push(`/quiz/${response.id}`);
      return;
    }

  }


  const validateBeforeSubmit = ()=>{

    if(newQuiz!.title.trim().length ===0){
      setError('please write title')
      return;
    }

    if(newQuiz!.description.trim().length === 0){
      setError('please write description');
      return;
    }
  }
  
    const handleSubmit = async  (e : FormEvent<HTMLFormElement>   ) => {
        //server action 추가하기.
        // 그림 개수, 정답 그림 등 검증하기
      e.preventDefault();

      validateBeforeSubmit();

      //TODO 4개중 하나라도 정의안되면 submit 금지하기
      const { answer, distractor1, distractor2,distractor3 } = newQuiz;

      if(!answer || !distractor1 || !distractor2 || !distractor3){
        setError('please write description');
        return;
      }

      const dto : CreateQuizDTO = {
        answerPaintingIds : [answer?.id],
        distractorPaintingIds : [distractor1?.id,distractor2?.id,distractor3?.id],
        title : newQuiz!.title,
        description : newQuiz!.description,
        type : newQuiz!.type,
        timeLimit : newQuiz.timeLimit
      }
      await callServerAction(dto,quiz);

    };

    const handleAddQuizPainting = async (key : StatePaintingKey, id : string) : Promise<boolean> =>{
        
          if(id.trim().length != id.length){
            setError(`Input ${key} has space or tab. please check start and end of string`);
            return false;
          }
      
          const UUID_SIZE = 36;
          if(id.length != UUID_SIZE){
            setError(`Input ${key} is out of ID format`);
            return false;
          }
          
          const painting = await getPaintingAction(id);
          if(isServerActionError(painting)){
              throw new Error(painting.message);
          }
          else if(isHttpException(painting)){
              const errorMessage = Array.isArray(painting.message) ? painting.message.join('\n') : painting.message;
              setError(errorMessage);
          }
          else{
            //id 중복 금지..

            if(isDuplicatedPaintingPainting(newQuiz,painting)){
                setError(`Can't Add painting. ${id} is already exist. `);
                return false;
            }

            mapPaintingKeyToAction(key,painting);


            return true;
        }
        return false;
        
    }

    const handleDeleteQuizPainting = async (key : StatePaintingKey) : Promise<boolean> => {
      mapPaintingKeyToAction(key,undefined);
      return true;

    }

    const handleChangeTitle = async (title : string ) =>{
      const MAX_LENGTH = 150;
      if(title.length > MAX_LENGTH){
        setError(`title can't be over ${MAX_LENGTH} characters`);
        return;
      }

      dispatch({type : 'SET_TITLE',title});

    }

    const handleChangeDescription = async (description : string) => {
      const MAX_LENGTH = 2000;

      if(description.length > MAX_LENGTH){
        setError(`description can't be over ${MAX_LENGTH} characters`);
        return;
      }
      dispatch({type : 'SET_DESCRIPTION',description});
    }
    
    // TODO: 훅 로직 점검하기 
    // - [x] debounce wrapper 훅 체크하기
    // - [ ] 기존 퀴즈 편집시 임시 저장 로직 추가하기.
    // - [ ] <추가 작업>
    // ! 주의: <경고할 사항>
    // ? 질문: <의문점 또는 개선 방향>
    // * 참고: <관련 정보나 링크>


    const saveNewQuizDebounced = useDebounceCallback(saveNewQuiz ,500);

    const loadNewQuiz = useCallback(()=>{
      const prevNewQuiz = getSavedNewQuiz();
      if(prevNewQuiz){
        dispatch({type :'SET_ALL', newQuiz : prevNewQuiz});
      }
    },[]);

    useEffect( ()=>{
      // 1.렌더링 된 후에 useEffect가 실행되므로, 저장된 값을 불러오는 동안에 깜빡이는 현상이 발생함.
      //=> 해결 방법 : newQuiz 상태의 초기값을 null로 지정. null인경우, loading 컴포넌트를 보여줌
      // 2. <InsertInput />요소의 값이 복원되지 않음.
      //=> 해결 방법 : <InsertInput /> prop에 전달될 값도 localStorage에 백업.
      if(!quiz){
        loadNewQuiz();
      }

    },[quiz,loadNewQuiz]);

    useEffect(()=>{
      if(!quiz){
        saveNewQuizDebounced(newQuiz);
      }
    },[newQuiz,quiz,saveNewQuizDebounced]);

  
    if(!newQuiz){

      return <Loading />
    }
  
    return (
      <div className="flex items-center justify-center h-full">
        {error &&<AlertModal message={error} onClose={async ()=>setError('')}/>}
        <form
          onSubmit={(e)=>handleSubmit(e)}
          className="rounded-lg shadow-lg text-white max-w-5xl md:min-w-[600px]"
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={newQuiz.title}
              onChange={(e) => handleChangeTitle(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600 transition"
              required
            />
          </div>

          <div key="painting selection" className="mb-4">
            <div className="grid grid-cols-1 gap-2 mb-2">
              <div className={`p-2 flex rounded-lg border-2 items-center gap-3 border-green-500`} >
                <CheckCircle className=" hidden md:block text-green-500" />
                <InsertToggleInput 
                    handleAdd={(value : string)=>handleAddQuizPainting('answer',value)}
                    handleDelete={()=>handleDeleteQuizPainting('answer')}
                    defaultIsInserted={newQuiz['answer'] ? true : false}
                    defaultValue={newQuiz['answer']?.id}
                    placeholder={'answer'}
                />
              </div>
              {
                distractorKeys
                  .map((key)=>
                    (<div key={key} className={`p-2 flex rounded-lg border-2 items-center gap-3 border-red-800`} >
                      <XCircle className=" hidden md:block text-red-500" />
                      <InsertToggleInput 
                        handleAdd={(value : string)=>handleAddQuizPainting(key,value)}
                        handleDelete={()=>handleDeleteQuizPainting(key)}
                        defaultIsInserted={newQuiz[key] ? true : false}
                        defaultValue={newQuiz[key]?.id}
                        placeholder={key}
                      />
                    </div>
                ))}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2"> Quiz Paintings </h1>
              <div className="bg-gray-500 grid min-h-56 sm:grid-cols-1 md:grid-cols-2 items-center p-2 rounded-lg border-gray-200 border-2 gap-4">
                  {newQuiz.answer 
                    && 
                    <div className={`rounded-lg border-2 border-green-500 max-w-xs`}>
                      <Card imageProps={{ src : newQuiz.answer.image_url, alt : newQuiz.answer.description, width : newQuiz.answer.width, height : newQuiz.answer.height  }} 
                            title={newQuiz.answer.title} />
                    </div>
                  }
                  {distractorKeys
                    .map((key)=> newQuiz[key])
                    .filter(p=> p!==undefined)
                    .map(p=>                          
                    (<div key={p.id} className={`rounded-lg border-2 border-red-800 max-w-xs`}>
                        <Card 
                          imageProps={{ src : p.image_url, alt : p.description, width : p.width, height : p.height  }}
                          title={p.title} 
                        />
                    </div>
                    ))
                  }
              </div>
            </div>
                       
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              value={newQuiz.description}
              onChange={(e) => handleChangeDescription(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-red-600 transition"
              required
            />
         </div>
         <div className="flex justify-center mb-10">
            <button type="submit" className="text-xl border-b-2 border-transparent hover:border-white"> {quiz === undefined ? 'Create' : 'Edit'} </button>
         </div>
        </form>
      </div>
    );
  }