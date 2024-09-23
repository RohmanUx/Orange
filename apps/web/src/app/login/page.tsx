  'use client';
import { UserContext } from '@/components/userContext';
import apiCall from '@/helper/axiosInstance';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Navbar } from '@/app/layout/navbar';
import Image from 'next/image'
interface ILoginPageProps { }

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {
  const router = useRouter();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const { user, setUser } = React.useContext(UserContext);
  const [Auth, IsAuth] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const onSubmit = async ( ) : Promise < void > => {
    try {
      const { data } = await apiCall.post('api/auth/login', {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      });

      console.log(data);
      // context redux globsal storage
      // simpan token
      toast(`Welcome ${data.result.email}`);
      // Menyimpan token pada localstorage
      localStorage.setItem('auth', data.result.token);

      // Menyimpan data email dan noTelp pada globalstate useContext
      setUser({ email: data.result.email, noTelp: data.result.noTelp });
      router.push('/');
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.error.message);
    }
  };

  React.useEffect(() => {
    if (user?.email) {
      // IsAuth(true)
      router.replace('/');
    }
    // setTimeOut
    // if(Auth) {
    //   router.replace("/")
    // }
  }, [user, IsAuth, router]); 

  if (!IsAuth) {
    return <p className="textr-center text-sm"> </p>;
  }

  return (
    <div className='pt-0'>
      <Navbar /> 


      <div className=" h-screen flex items-center pt-14">
      <Image
        src="/Untitled design.png"
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-10 pt-14"
      />
        <div
          id="container"
          className="w-96 bg-slate-100/60 m-auto shadow-lg rounded-md p-7 backdrop-blur-3xl"
        >
          <h1 className="w-full text-center font-semibold text-2xl">LOGIN </h1>
          <div className="h-80 flex flex-col justify-between mt-4 px-0">
            <div>
              <label className="block text-xl my-2">Email </label>
              <input
                className="w-full p-2 rounded-md flex-1 border-2 border-black/60 bg-gray-300/0 placeholder-black" 
                placeholder='mail'
                type="text"
                ref={emailRef}
              />
            </div>
            <div>
              <label className="block text-xl my-2">Password </label>
              <div className="relative flex items-center">
                <input
                  className="w-full p-2 rounded-md flex-1 border-2 border-black/60 bg-gray-300/0 placeholder-black" 
                  placeholder='password'
                  type={isVisible ? 'text' : 'password'}
                  ref={passwordRef}
                />
                <button
                  className="absolute right-4"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <MdVisibility size={24} />
                  ) : (
                    <MdVisibilityOff size={24} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="border border-slate-600 text-slate-600 p-3 w-full rounded-md shadow my-4"
                onClick={() => router.push('/register')}
              >
                Regis
              </button>
              <button
                className="bg-slate-500 text-white p-3 w-full rounded-md shadow my-4"
                onClick={onSubmit}
              >
                Login
              </button>
            </div>
            <div className="w-full p-0 rounded-md bg-gray-100/0 text-center" 
            >
              { ' ' }
              Reset password? { ' ' }
            </div>
          </div>
        </div>
      </div> { ' ' }
    </div>
  );
};

export default LoginPage;
