import Link from "next/link";
import { AUTH_LOGIC_ROUTE } from "../../route/auth/route";
import { PROFILE_LOGIC_ROUTE } from "../../route/profile/route";


// TODO : Profile page 개선
// - [ ] : 사용자가 생성한 퀴즈 목록 볼수 있는 page 추가하기

export default function ProfilePage() {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <SettingsMenu />
      </main>
    );
  }
    

  
  const menuItems = [
    { label: "Update Password", href: AUTH_LOGIC_ROUTE.VERIFY_USER('update-password')},
    { label: "Update Username", href: PROFILE_LOGIC_ROUTE.SETTING_ACCOUNT },
    { label: "Delete Account", href: AUTH_LOGIC_ROUTE.VERIFY_USER('delete-account') , highlight : true},
  ];
  
function SettingsMenu() {
    return (
      <div className="w-full max-w-md">
        <table className="w-full border bg-zinc-900 border-zinc-700 rounded-2xl overflow-hidden">
        <tbody>
          {menuItems.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === menuItems.length - 1;
            return (
              <tr
                key={item.href}
                className={`border-b border-zinc-700 hover:bg-zinc-600 transition-colors duration-200
                } ${
                  isFirst ? "first:rounded-t-2xl" : ""
                } ${isLast ? "last:rounded-b-2xl border-b-0" : ""}`}
              >
                <td className="p-4 text-center">
                  <Link
                    href={item.href}
                    className={`text-lg font-semibold hover:underline ${
                      item.highlight ? "text-red-400" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    );
  }