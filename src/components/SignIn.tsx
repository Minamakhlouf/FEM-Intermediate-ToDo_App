import { FaUser, FaGoogle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState, useRef } from "react";
import { auth, googleProvider } from "../firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import SignInBtn from "./SignInBtn";
import SignInInput from "./SignInInput";
import ButtonEvent from "./ButtonEvent";
import { FirebaseError } from "firebase/app";

function SignIn(){
    const [isNewUser, setIsNewUser] = useState(true); 
    const [isError, setIsError] = useState(""); 

    const emailRef = useRef<HTMLInputElement>(null); 
    const pwdRef = useRef<HTMLInputElement>(null)

    const AUTH_ERROR: Record<string, string> = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/missing-password": "Please enter your password.", 
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/email-already-in-use": "That email is already registered. Try signing in.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account found for that email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/operation-not-allowed": "Email/password auth is not enabled for this project.",
    };

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); 

      const email = emailRef.current?.value.trim() ?? "";
      const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); 
      const password = pwdRef.current?.value ?? ""; 

      // Client Side Validation
      if (!email) return setIsError("Please enter your email"); 
      if (!isValidEmail(email)) return setIsError("Please enter a valid email address"); 
      if (!password) return setIsError("Please enter a password"); 
      if (isNewUser && password.length < 6) return setIsError("Password must be greater than 6 characters"); 
      
      try {
        if (isNewUser) {
          await createUserWithEmailAndPassword(auth, email,  password)
        } else {
          await signInWithEmailAndPassword(auth, email, password)
        }

        console.log(emailRef.current?.value)
        console.log(pwdRef.current?.value)

        if (emailRef.current) emailRef.current.value = "";
        if (pwdRef.current) pwdRef.current.value = "";
      } catch(e: any) {
        const message = 
          e instanceof FirebaseError 
           ? AUTH_ERROR[e.code] ?? "Something went wrong. Please try again."
           : "Unexpected error. Please try again.";
        setIsError(message); 
        console.log(e.message); 
      }
    }

    const signInWithGoogle = async () => {
      try {
        await signInWithPopup(auth, googleProvider)
      } catch (err) {
        console.error(err)
      }
    }

    return (
        <>
        <div className="container-bg mt-[-28px] max-w-[33.75rem] mx-auto rounded-lg overflow-hidden shadow-xl dark:shadow-none">
            <div>
              <div className='flex border-b border-[#979797]'>
                <SignInBtn isNewUser={isNewUser} title="Sign Up" changeTab={setIsNewUser}/>
                <SignInBtn isNewUser={isNewUser} title="Sign In" changeTab={setIsNewUser}/>
              </div>
              <div className="p-[1.25rem]">
                <h2 className="dark:text-[#C8CBE7] text-center text-xl font-bold mb-[1rem]">{!isNewUser ? "Do you have an account?" : "Not a member?"}</h2>
                <p className="mb-[1rem]">{!isNewUser ? "Sign in below with your email address and password you used during sign-up." : "No problem! Make an account today, all we need is an email address and a password."}</p>
                <form noValidate onSubmit={onSubmit}>
                  <SignInInput ref={emailRef} Icon={FaUser} type={"email"} placeholder={"Email Address"}/>
                  <SignInInput ref={pwdRef} Icon={RiLockPasswordFill} type={"password"} placeholder={"Password"}/>
                  <button className={`mb-[1rem] py-[1rem] text-center w-[100%] border border-black dark:border-[#C8CBE7] dark:text-[#C8CBE7] cursor-pointer hover:bg-[hsl(270,60%,40%)] dark:hover:bg-[hsl(270,70%,60%)] hover:text-[#FFF] dark:hover:text-[#FFF]`}>Submit</button>
                </form>
                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
                  <span className="text-xs text-black/60 dark:text-white/60 tracking-wide">OR</span>
                  <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
                </div>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className={`mb-[1rem] py-[1rem] text-center w-[100%] border border-black dark:border-[#C8CBE7] dark:text-[#C8CBE7] cursor-pointer hover:bg-[hsl(270,60%,40%)] dark:hover:bg-[hsl(270,70%,60%)] hover:text-[#FFF] dark:hover:text-[#FFF] flex justify-center items-center gap-[0.5rem]`}
                >
                  <FaGoogle className="dark:text-[#C8CBE7]"/> <div>Continue with Google</div>
                </button>
              </div>
            </div>
        </div>
        {isError ? 
        (
          <div onClick={() => { setIsError("")}} className={`absolute inset-0 bg-black/70 flex justify-center content-center flex-wrap z-10 px-[1.5rem]`}>
            <div className="p-[1.5rem] container-bg flex flex-col gap-[1rem] content-center">
              <h2 className="text-center text-xl dark:text-[#C8CBE7]">Error!</h2>
              <p>{isError}</p>
              <ButtonEvent text="I Understand" onClickHandler={() => {setIsError("")}}/>
            </div>
          </div>
        ) : 
        null
        }
        </>
    )
}

export default SignIn; 