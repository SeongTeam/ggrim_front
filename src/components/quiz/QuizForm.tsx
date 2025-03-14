'use client'
import {  FormEvent,  useEffect, useRef, useState } from "react";
import { Painting } from "../../model/interface/painting";
import { addQuiz, getPainting } from "../../app/lib/api.backend";
import { Card } from "../card";
import { CreateQuizDTO } from "../../app/lib/dto";
import { Quiz } from "../../model/interface/quiz";
import { useRouter } from "next/navigation";
import AlertModal from "../home/components/AlertModal";
import { debounce } from "../../util/optimization";
import { InsertToggleInput } from "../InsertToggleInput";

interface NewQuiz{
    answerPaintingID :string;
    distractorPaintingIDs :string[];
    title : string;
    timeLimit: number;
    description : string;
    type: 'ONE_CHOICE';

}


// TODO: QuizForm() 개선
// - [ ] : 그림 보여주기 영역 디버깅
// - [ ] : 폼 디자인 꾸미기
// - [ ] : detail Painting Modal에서 Painting ID 바로 볼수 있게 명시하기
// - [x] : 브라우저 캐시에 form context 저장하는 로직 추가
// - [x] : 브라우저 캐시에서 form context 가져오는 로직 추가
//  -> 사용자가 painting id를 검색하러 페이지를 옮길 수 있으므로, 현재 컨텍스트를 따로 보관해야함
// - [x] : title,description, input 크기 제한하기
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

const QUIZ_FORM_KEY = 'new-quiz';
const QUIZ_PAINTING_KEY = 'quiz-painting'
const TIME_LIMIT = 30;
export default function QuizForm() : JSX.Element {
    const [newQuiz,setNewQuiz] = useState<NewQuiz|null>(null);
    const [quizPaintingMap, setQuizPaintingMap] = useState<Map<string,Painting>>(new Map());
    const [error,setError] = useState("");
    const router = useRouter();
    const quizPaintingKeys : string[] = ['Answer painting','Distractor1','Distractor2','Distractor3'];
  
    const handleSubmit = async  (e : FormEvent<HTMLFormElement>   ) => {
        //server action 추가하기.
        // 그림 개수, 정답 그림 등 검증하기
      e.preventDefault();

      if(newQuiz!.title.trim().length ===0){
        setError('please write title')
        return;
      }

      if(newQuiz!.description.trim().length === 0){
        setError('please write description');
        return;
      }

      if(quizPaintingMap.size < 4){
        setError('please fill four paintings');
        return;
      }


      const dto : CreateQuizDTO = {
        answerPaintingIds : [newQuiz!.answerPaintingID],
        distractorPaintingIds : [...newQuiz!.distractorPaintingIDs],
        title : newQuiz!.title,
        description : newQuiz!.description,
        type : newQuiz!.type,
        timeLimit : 30
      }
      const quiz : Quiz|undefined = await addQuiz(dto);

      if(quiz){
        localStorage.removeItem(QUIZ_FORM_KEY);
        localStorage.removeItem(QUIZ_PAINTING_KEY);
        console.log(`create new Quiz`,quiz);
        router.push(`/quiz/${quiz.id}`);
        return;
      }
      setError('please try later');

    };

    const handleAddQuizPainting = async (key : string,id : string) : Promise<boolean> =>{
        
          if(id.trim().length != id.length){
            setError(`Input ${key} has space or tab. please check start and end of string`);
            return false;
          }
      
          const UUID_SIZE = 36;
          if(id.length != UUID_SIZE){
            setError(`Input ${key} is out of ID format`);
            return false;
          }
          const painting = await getPainting(id);

          if(!painting){
              setError(`Can't find painting. ${id} is invalid. `);
              return false;
          }

          if(quizPaintingMap.size === 4){
            setError(`Can't add painting. Only 4 painting is added. `);
            return false;
          }

          //id 중복 금지..

          if(quizPaintingMap.values().find(p=>p.id === id)){
              setError(`Can't Add painting. ${id} is already exist. `);
              return false;
          }

          setQuizPaintingMap(prevMap=>{
            const newMap = new Map(prevMap);
            newMap.set(key,painting);
            return newMap;
          });

          //어떻게 setNewQuiz를 사용할까/
          if(quizPaintingKeys[0] === key){
              setNewQuiz(prev=>({...prev!,answerPaintingID : id}));
          }
          else{
              setNewQuiz(prev=>({...prev!,distractorPaintingIDs : [...prev!.distractorPaintingIDs,id]}));
          }

          return true;

        
    }

    const handleDeleteQuizPainting = async (key : string,id : string) : Promise<boolean> => {
      if(!quizPaintingMap.has(key)){
        setError(`${key} is seemed to be not written. please refresh page`);
      }
      const newMap = new Map(quizPaintingMap);
      newMap.delete(key);
        setQuizPaintingMap(newMap);
        if(id === newQuiz!.answerPaintingID){
            setNewQuiz(prev=>({...prev!,answerPaintingID : ""}));
        }
        else{
            const distractors  = [...quizPaintingMap.values()].map(p=> p.id).filter(paintingID=> paintingID !== id && paintingID !== newQuiz?.answerPaintingID);
            setNewQuiz(prev=>({...prev!,distractorPaintingIDs : [...distractors]}));
        }
        return true;

    }

    const handleChangeTitle = async (title : string ) =>{
      const MAX_LENGTH = 150;
      if(title.length > MAX_LENGTH){
        setError(`title can't be over ${MAX_LENGTH} characters`);
        return;
      }

      setNewQuiz(prev=>({...prev!, title }));

    }

    const handleChangeDescription = async (description : string) => {
      const MAX_LENGTH = 2000;

      if(description.length > MAX_LENGTH){
        setError(`description can't be over ${MAX_LENGTH} characters`);
        return;
      }
      setNewQuiz(prev=>({...prev!, description}));
    }
    
    //TODO debounce 체크 필요
    const saveNewQuiz = useRef(debounce( (value : NewQuiz|null) => {
      localStorage.setItem(QUIZ_FORM_KEY,JSON.stringify(value));
    },500));

    const loadNewQuiz = useRef(()=>{
      const rawPrevNewQuiz : string|null = localStorage.getItem(QUIZ_FORM_KEY);
      const prevNewQuiz : NewQuiz = rawPrevNewQuiz && JSON.parse(rawPrevNewQuiz)  ? JSON.parse(rawPrevNewQuiz) : {
        answerPaintingID : "",
        distractorPaintingIDs :[] as string[],
        title : "",
        timeLimit : TIME_LIMIT,
        description : "",
        type : 'ONE_CHOICE'
      };
      setNewQuiz(prevNewQuiz);      
      console.log('useEffect : load rawPrevNewQuiz',prevNewQuiz);
      console.log(`value :`,rawPrevNewQuiz && JSON.parse(rawPrevNewQuiz));
    });

    const saveQuizPainting = useRef(debounce( (value : Map<string,Painting>) => {
      //Q.왜 map은 저장시에 Object.fromEntries()를 사용하지?
      const jsonObject = Object.fromEntries(value);
      localStorage.setItem(QUIZ_PAINTING_KEY,JSON.stringify(jsonObject));
    },500));

    const loadQuizPaintingMap = useRef(()=>{
      const rawPrevQuizPaintings : string |null = localStorage.getItem(QUIZ_PAINTING_KEY);
      if(rawPrevQuizPaintings){
        try{
          const parsed = JSON.parse(rawPrevQuizPaintings);
          const restoredMap = new Map<string,Painting>(Object.entries(parsed));
          setQuizPaintingMap(restoredMap);
        }catch(e : unknown){
          console.error("Failed to load map from localStorage", e);
          setError('Failed to load Quiz paintings from browser');
        }
      }
    });


    useEffect( ()=>{
      // 1.렌더링 된 후에 useEffect가 실행되므로, 저장된 값을 불러오는 동안에 깜빡이는 현상이 발생함.
      //=> 해결 방법 : newQuiz 상태의 초기값을 null로 지정. null인경우, loading 컴포넌트를 보여줌
      // 2. <InsertInput />요소의 값이 복원되지 않음.
      //=> 해결 방법 : <InsertInput /> prop에 전달될 값도 localStorage에 백업.
      loadNewQuiz.current();
      loadQuizPaintingMap.current();

    },[]);

    useEffect(()=>{
      saveNewQuiz.current(newQuiz);
      saveQuizPainting.current(quizPaintingMap);
    },[newQuiz,quizPaintingMap]);

  
    if(!newQuiz || !quizPaintingMap){
      //TODO loading page 만들기
      return <p> Loading...</p>;
    }
  
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        {error.trim().length > 0 &&<AlertModal message={error} onClose={async ()=>setError('')}/>}
        <form
          onSubmit={(e)=>handleSubmit(e)}
          className="bg-gray-900 p-8 rounded-lg shadow-lg text-white max-w-5xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Create Quiz
          </h2>
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
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">

              {
                quizPaintingKeys.map(key=>            
                
                <InsertToggleInput 
                  key={key}
                  handleAdd={(value : string)=>handleAddQuizPainting(key,value)}
                  handleDelete={(value: string)=>handleDeleteQuizPainting(key,value)}
                  defaultIsInserted={quizPaintingMap.has(key)}
                  defaultValue={quizPaintingMap.get(key)?.id}
                  placeholder={key}
              />)
              }
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2"> Quiz Paintings </h1>
              <div className="bg-gray-500 grid min-h-56 sm:grid-cols-2 md:grid-cols-4 items-center p-2 rounded-lg border-gray-200 border-2 gap-4">
                  {quizPaintingKeys.map((key,idx)=>{
                      const painting : Painting | undefined = quizPaintingMap.get(key);
                      if(!painting){
                          return null;
                      }
                      const borderColor = idx===0 ? "border-green-500" : "border-red-800";
                      const {id,image_url,title,description } = painting;
                      return (
                          <div key={id} className={`rounded-lg border-2 ${borderColor} max-w-xs`}>
                              <Card imageSrc={image_url} title={title} alt={description}/>
                          </div>
                      );
                    })
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
         <div className="flex justify-center">
         <button type="submit" className="text-xl border-b-2 border-transparent hover:border-white"> Create </button>
         </div>
        </form>
      </div>
    );
  }