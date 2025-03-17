import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickHome = ()=>{
    router.push('/');
  }

  const handleClickQuiz = ()=>{
    router.push('/quiz');
  }

  const handleClickCreateQuiz = () =>{
    router.push('/quiz/create');
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* 모바일 메뉴 버튼 */}
      <button
        className="md:hidden text-white p-2"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 네비게이션 메뉴 */}
      <ul
        className={`absolute md:relative top-full left-0 w-full min-w-48 md:w-auto bg-gray-900 md:bg-transparent p-4 md:p-0 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-white text-sm ${
          isOpen ? "block" : "hidden md:flex"
        }`
        }
      >
        <li className="hover:text-gray-300 cursor-pointer" onClick={() => handleClickHome()}>
          Home
        </li>
        <li className="hover:text-gray-300 cursor-pointer" onClick={() => handleClickQuiz()}>
          Quiz
        </li>
        <li className="hover:text-gray-300 cursor-pointer" onClick={() => handleClickCreateQuiz()}>
          Create Quiz
        </li>
      </ul>
    </div>
  );
}