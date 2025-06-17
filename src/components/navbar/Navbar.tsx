import NavbarMenu from "./NavbarMenu";
import { SearchPaintingIconMenu } from "./SearchPaintingIconMenu";
import { NotifyIconMenu } from "./NotificationIconMenu";
import { ProfileIconMenu } from "./ProfileIconMenu";
import { getSignInInfo } from "../../server-action/backend/cookie";
import { User } from "@/server-action/backend/user/type";
import Link from "next/link";


// TODO: NavBar UI 개선
// - [x] 검색창 생성시, NavBar 깜박이는 버그 수정
// - [x] 검색창 생성시, menu list 옆으로 밀리는 버그 수정
// - [x] 자식 컴포넌트 그룹지어서 분리하기
//  -> <할 일 > 설명 ( 생략가능 )
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>

export default async function Navbar() {

  const user :User|undefined = await getSignInInfo();

  // console.log(user);
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      bg-black/90 shadow-md`}
    >
      <div>
        <div className="flex items-center md:justify-between px-6 py-4">
          {/* 로고 */}
          <div className="text-yellow-300 text-2xl font-bold">Ggrim</div>

          <NavbarMenu />
          <div id="response-spacer" className="flex-grow md:hidden" /> {/* 자동 확장 Spacer */}
          {/* 아이콘 메뉴 */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <SearchPaintingIconMenu />
            </div>
            {!user && 
                <Link
                  href="/auth/sign-in"
                  className="inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-300 shadow-md"
                >
                  Sign In
                </Link>
            }
            {user &&
              <div className="flex space-x-4">
                <NotifyIconMenu />
                <ProfileIconMenu user={user} />
              </div>
            }
          </div>
        </div>
      </div>
    </nav>
  );
}

