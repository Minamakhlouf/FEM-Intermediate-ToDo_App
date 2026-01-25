
type SignInBtnProps = {
    isNewUser: Boolean; 
    title: string; 
    changeTab: React.Dispatch<React.SetStateAction<boolean>>; 
}

function SignInBtn({isNewUser, title, changeTab}: SignInBtnProps) {
    let backgroundAndTextColor; 

    if (isNewUser && title === "Sign Up") {
        backgroundAndTextColor = "bg-[hsl(270,60%,40%)] dark:bg-[hsl(270,70%,60%)] text-[#FFFFFF]"
    } else if (!isNewUser && title === "Sign In") {
        backgroundAndTextColor = "bg-[hsl(270,60%,40%)] dark:bg-[hsl(270,70%,60%)] text-[#FFFFFF]"
    } else {
        backgroundAndTextColor = "text-[#494C6B] dark:text-[#4d5067]"
    }

    const onTabChangeListener = () => {
        isNewUser && title === "Sign In" ? changeTab(false) : changeTab(true); 
    }

    return (
        <button onClick={onTabChangeListener} className={`flex-grow py-[1rem] ${backgroundAndTextColor} hover:text-[#FFFFFF] dark:hover:text-[#C8CBE7] hover:bg-[hsl(270,60%,40%)] dark:hover:bg-[hsl(270,70%,60%)] cursor-pointer`}>{title}</button>
    )
}

export default SignInBtn