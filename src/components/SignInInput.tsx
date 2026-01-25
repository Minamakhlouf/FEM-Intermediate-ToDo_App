import type { IconType } from "react-icons"; // <- this is the type of all react-icons
import { forwardRef } from "react";

type SignInInputProps = {
  Icon: IconType;            // component from react-icons
  type: string;              // "email", "password", etc.
  placeholder: string;
};

const SignInInput = forwardRef<HTMLInputElement, SignInInputProps>(({Icon, type, placeholder}, ref) => {
    const containerTailwind = "flex items-center mb-[1rem] px-[1.25rem] py-[1rem] gap-[.75rem] outline focus-within:ring-2 focus-within:ring-black-500 dark:focus-within:ring-[#C8CBE7] dark:border dark:border-[#C8CBE7]"
    const inputTailwind = "flex-grow outline-none focus:outline-none"

    return <div className={containerTailwind}><Icon className="dark:text-[#C8CBE7]"/><input ref={ref} type={type} placeholder={placeholder} className={inputTailwind}/></div>
})

export default SignInInput; 