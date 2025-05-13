import Link from "next/link";
import { AUTH_LOGIC_ROUTE } from "../../route/auth/route";

export default function AuthPage() {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <SettingsMenu />
      </main>
    );
  }
    

  
  const menuItems = [
    { label: "Update Password", href: AUTH_LOGIC_ROUTE.VERIFY_USER('update-password')},
    { label: "Update Username", href: "/settings/update-username" },
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