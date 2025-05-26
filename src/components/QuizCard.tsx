
export interface QuizCardProps {
    title : string,
    onClick : ()=>void
  }

      // TODO: <QuizCard /> UI 개선
    // - [ ] 사용자에게 보여줄 정보 추가
    // ! 주의: <경고할 사항>
    // ? 질문: <의문점 또는 개선 방향>
    // * 참고: <관련 정보나 링크>
  
export function QuizCard({ title, onClick}: QuizCardProps) {
    const size = 60;
    const uiTitle = title.length > size ? title.slice(0,size) + '...' : title;
    return (

          <div className="bg-gray-900 rounded-lg overflow-hidden  hover:bg-gray-700" >
            <div className="bg-white p-2 pt-4 rounded-lg h-32 md:h-40 ">
              <p className="text-gray-700 text-lg font-bold font-sans-serif">{uiTitle}</p>
            </div>

            <div className="m-3 ">
            <p className="inline-block text-slate-200 border-b-2 border-transparent hover:border-slate-200 hover:border-b-2 transition-all cursor-pointer"
              onClick={onClick}
            >
              Play
            </p>
            </div>
          </div>
        );
  }