import Link from "next/link";
import { AUTH_LOGIC_ROUTE } from "../../route/auth/route";

type FooterState = keyof typeof AUTH_LOGIC_ROUTE;
export interface AuthFooterProps {
    state : FooterState
}

interface LinkInfo {

    text : string;
    authRoute : string;

}

const forgotPassWordLinkInfo = { text : `Forget Password?`, authRoute : AUTH_LOGIC_ROUTE.VERIFY_USER_BY_EMAIL('update-password') };
const haveAccountLinkInfo = {text : `Have Account`, authRoute : AUTH_LOGIC_ROUTE.SIGN_IN,};
const createAccountLinkInfo = { text : `Create Account`, authRoute : AUTH_LOGIC_ROUTE.VERIFY_EMAIL };

const AuthFooter = ({state } : AuthFooterProps) => {

    const infos : LinkInfo[] = [];


    switch(state) {

        case 'DELETE_ACCOUNT' :
        case 'UPDATE_PASSWORD' :
            infos.push(forgotPassWordLinkInfo)
            break;
        case 'SIGN_UP' :
        case 'VERIFY_EMAIL' :
            infos.push(haveAccountLinkInfo);
            infos.push(forgotPassWordLinkInfo)
            break;
        case 'SIGN_IN' : 
        case 'VERIFY_USER' :
            infos.push(createAccountLinkInfo)
            infos.push(forgotPassWordLinkInfo)
            break;
        case 'VERIFY_USER_BY_EMAIL' :
            infos.push(createAccountLinkInfo)
            infos.push(haveAccountLinkInfo);
            break;
        default :
            throw new Error('Not Implement Access');
    }



    return (
    <div className="flex justify-between">
        {infos.map(info =>
        <p className="mt-4 text-sm text-gray-400" key={info.authRoute}>
          <Link href={info.authRoute} className="text-white hover:underline">{info.text} </Link>
        </p>
        )}
      </div>
    );

}

export default AuthFooter;