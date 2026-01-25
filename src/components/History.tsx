import { collection, query, where, getDocs, orderBy} from "firebase/firestore"; 
import { db, auth} from "../firebase"
import { useState, useEffect} from "react"
import type { Todo, TodoData, Calendar} from "../sharedTypes";
import HistoryDatePicker from "./HistoryDatePicker";
import HistoryDatePicked from "./HistoryDatePicked";
import HistoryGreetingMsg from "./HistoryGreetingMsg";

type HistoryProps = {
    onExitHistory: () => void; 
}


const History = ({onExitHistory}: HistoryProps) => {
    const [userCalendar, setUserCalendar] = useState<null | Calendar>(null)
    const [hasHistory, setHasHistory] = useState<boolean>(true)
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [todosChosen, setTodosChosen] = useState<boolean>(false); 
    const [todosToRender, setTodosToRender] = useState<Todo[] | null>(null)

    console.log("History Component Re-rendered")

    useEffect(() => {
        const uid = auth.currentUser?.uid; 
        if (!uid) return; 

        const date = new Date(); 
        const currentDate = date.toLocaleDateString("en-CA"); 

        const fetchHistoryDates = async () => {
            const q = query(
                collection(db, "todos"), 
                where("uid", "==", uid)
            ); 

            const snap = await getDocs(q); 

            const docs = snap.docs.map(doc => doc.data()).map(obj => obj.dayKey).filter(obj => obj !== currentDate);
            
            const uniqueDates = [...new Set(docs)]

            if (uniqueDates.length < 1) {
                setHasHistory(false); 
                return; 
            }

            const calendar: Calendar = {} 

            uniqueDates.forEach(date => {
                const [year, month, day] = date.split("-"); 

                if (!calendar[year]) calendar[year] = {}; 
                if (!calendar[year][month]) calendar[year][month]=new Set(); 
                calendar[year][month].add(day); 
            })
            
            setUserCalendar(calendar)
        }

        void fetchHistoryDates(); 
    }, [])

    // Years: all keys of calendar
    const yearOptions = userCalendar
    ? Object.keys(userCalendar).sort() 
    : [];

    // Months: based on selectedYear
    const monthOptions =
    userCalendar && selectedYear && userCalendar[selectedYear]
        ? Object.keys(userCalendar[selectedYear]).sort()
        : [];

    // Days: based on selectedYear + selectedMonth
    const dayOptions =
    userCalendar &&
    selectedYear &&
    selectedMonth &&
    userCalendar[selectedYear] &&
    userCalendar[selectedYear][selectedMonth]
        ? Array.from(userCalendar[selectedYear][selectedMonth]).sort()
        : [];

    const onDateChosen = async() => {
        const dayKey = `${selectedYear}-${selectedMonth}-${selectedDay}`;

        const uid = auth.currentUser?.uid;
        if (!uid) return;

        try {
            const q = query(
            collection(db, "todos"),
            where("uid", "==", uid),
            where("dayKey", "==", dayKey),
            orderBy("order", "asc") // optional if you want consistent order
            );

            const snap = await getDocs(q);

            const todos: Todo[] = snap.docs.map((doc) => ({
                id: doc.id, ...(doc.data() as TodoData)
            }));

            console.log(todos)

            setTodosToRender(todos);
            setTodosChosen(true);
        } catch (err) {
            console.error("Error fetching todos for selected date:", err);
        }
    }

    const onReturnToDatePicker = () => {
        setTodosChosen(false); 
        setTodosToRender(null); 
        setSelectedDay(""); 
        setSelectedMonth("");
        setSelectedYear("")
    }

    return (
            <div className="container-bg mt-[-6rem] relative py-[1rem] px-[1.25rem] sm:py-[1.25rem] sm:px-[1.5rem] rounded-lg shadow-xl">
              <h2 className="text-2xl mb-[1rem] text-[#393A4B] dark:text-[hsl(234,39%,85%)] text-center">History</h2>
              <HistoryGreetingMsg todosChosen={todosChosen} todosToRender={todosToRender} selectedDay={selectedDay} selectedMonth={selectedMonth} selectedYear={selectedYear}/>
              {
              todosChosen && todosToRender ? 
              <HistoryDatePicked todosToRender={todosToRender} onExitHistory={onExitHistory} onChangeDate={onReturnToDatePicker}/>
              :
              <HistoryDatePicker
                onExitHistory={onExitHistory}
                onDateChosen={onDateChosen}
                userCalendar={userCalendar}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDay={selectedDay}
                setSelectedYear= {setSelectedYear}
                setSelectedDay={setSelectedDay}
                setSelectedMonth={setSelectedMonth}
                hasHistory={hasHistory}
                yearOptions={yearOptions}
                monthOptions={monthOptions}
                dayOptions={dayOptions}
              />
              }
            </div>
    )
}

export default History; 