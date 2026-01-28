import './App.css'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import SignIn from "./components/SignIn"; 
import { auth, db  } from "./firebase"
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, onSnapshot, serverTimestamp, getDocs, query, where, orderBy} from "firebase/firestore"; 
import ToDoContainer from './components/ToDoContainer';
import ButtonEvent from './components/ButtonEvent';
import type { TodoData, Todo } from './sharedTypes';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isSignedIn, setIsSignedIn] = useState(false); 
  const [toDoArray, setToDoArray] = useState<Todo[]>([]); 
  const [isHistory, setIsHistory] = useState(false); 
  const [authLoading, setAuthLoading] = useState(true)

  const History = lazy(() => import("./components/History"))

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const checkUserSignInStatus = onAuthStateChanged(auth, (user)=> {
        setIsSignedIn(!!user);
        setAuthLoading(false); 
    })
    return checkUserSignInStatus; 
  }, []); 

  useEffect(() => {
    if (!isSignedIn || !auth.currentUser) return 

    const uid = auth.currentUser.uid; 
    const dayKey = new Date().toLocaleDateString("en-CA"); 

    const q = query(
      collection(db, "todos"),
      where("uid", "==", uid),
      where("dayKey", "==", dayKey), 
      orderBy("order", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setToDoArray(snap.docs.map(d => ({ id: d.id, ...(d.data() as TodoData) })));
    });
    return unsub; // cleanup     
  }, [isSignedIn])

  const darkModeChangeHandler = () => {
    setIsDarkMode((prevMode) => { return !prevMode})
  }

  const backgroundMobile = isDarkMode ? `bg-[url("/images/bg-mobile-dark.webp")]` : `bg-[url("/images/bg-mobile-light.webp")]`
  const backgroundDesktop = isDarkMode ? `sm:bg-[url("/images/bg-desktop-dark.webp")]` : `sm:bg-[url("/images/bg-desktop-light.webp")]`

  const logUserOut = () => {
    setIsSignedIn(false); 
    signOut(auth); 
  }

  const todoInputRef = useRef<HTMLInputElement>(null);

  const onCreateToDo = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = todoInputRef.current?.value.trim() ?? "";
    if (!text) return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const dayKey = new Date().toLocaleDateString("en-CA");

    // Optional: keep this pre-check if you want to avoid same-day duplicates by text
    const q = query(
      collection(db, "todos"),
      where("uid", "==", uid),
      where("dayKey", "==", dayKey),
      where("text", "==", text)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      console.log("Already written To Do");
      return;
    }

    // Just write; let onSnapshot update state
    await addDoc(collection(db, "todos"), {
      uid,
      text,
      isActive: true,
      dayKey,
      createdAt: serverTimestamp(),
      order: Date.now() 
    });

    if (todoInputRef.current) todoInputRef.current.value = "";
  };

  const onHistorySelected = () => {
    isHistory ? setIsHistory(false) : setIsHistory(true); 
  }

  const onExitHistory = () => {
    setIsHistory(false)
  }

  const toDoFormElement = 
    <form onSubmit={onCreateToDo} className='py-[0.875rem] px-[1.25rem] dark:bg-[hsl(235,24%,19%)] flex content-center items-center gap-[.75rem] max-w-[33.75rem] mx-auto bg-white rounded-md focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-[#C8CBE7]'>
      <button type="submit" className='cursor-pointer w-[1.25rem] sm:w-[1.5rem] aspect-square rounded-[50%] border border-[#e3e4f1] dark:border-[#767992]'></button>
      <input ref={todoInputRef}  type="text" placeholder='Create a new todo...'/>
    </form>; 

  const loadingPageElement = 
    <section className='container-bg mt-[-6rem] relative py-[1rem] px-[1.25rem] sm:py-[1.25rem] sm:px-[1.5rem] rounded-lg shadow-xl min-h-[55vh] flex justify-center items-center'>
      <h2 className='text-[1.5rem] sm:text-[2rem]'>Checking sign-in status.</h2>
    </section>

  return (
    <main className='min-h-screen bg-[#FAFAFA] dark:bg-[hsl(235,21%,11%)] relative pb-[6rem]'>
        <div className={`pt-[3rem] pb-[2.75rem] px-[1.5rem] ${backgroundMobile} bg-cover ${backgroundDesktop}`}>
            <div className='flex content-center items-center justify-between max-w-[33.75rem] flex-grow mb-[2.5rem] mx-auto'>
              <h1 className='text-[1.25rem] sm:text-[2.5rem] text-white font-bold tracking-[.9375rem]'>TODO</h1>
              {isSignedIn ? <div className='flex content-center items-center gap-[1rem] ml-auto mr-[1.5rem]'><ButtonEvent onClickHandler={onHistorySelected} text={isHistory ? "Today" : "History"}/> <ButtonEvent onClickHandler={logUserOut} text='Logout'/></div> : null} 
              <button className='cursor-pointer' onClick={darkModeChangeHandler} aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
                <img src={`${isDarkMode ? "images/icon-sun.svg" : "images/icon-moon.svg"}`} alt="" aria-hidden="true" className={``}/>
              </button>
            </div>
            {
              isSignedIn ?
              toDoFormElement : 
              <h2 className='py-[0.875rem] px-[1.25rem] dark:text-[#C8CBE7] dark:bg-[#25273D] flex justify-center max-w-[33.75rem] mx-auto bg-white rounded-md text-center'>Take control of your goals today!</h2>
            }
        </div>
        <section className='mt-[-28px] px-[1.5rem] bg-transparent'>
            <div className='max-w-[33.75rem] mx-auto'>
            { authLoading ?
            loadingPageElement :
            !isSignedIn ? 
            <SignIn/> : 
            isHistory ? 
            <Suspense fallback={<div>Loading...</div>}>
              <History onExitHistory={onExitHistory}/>
            </Suspense> :
            <ToDoContainer todos={toDoArray} setTodos={setToDoArray}/> 
            }
            </div>
        </section>
    </main>
  )
}

export default App
