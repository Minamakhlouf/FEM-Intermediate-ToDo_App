import type { Todo } from "../sharedTypes";

type HistoryGreetingMsgProps = {
    todosChosen: boolean; 
    todosToRender: Todo[] | null; 
    selectedYear: string; 
    selectedMonth: string; 
    selectedDay: string; 
}

const HistoryGreetingMsg = ({todosChosen, todosToRender, selectedDay, selectedMonth, selectedYear}: HistoryGreetingMsgProps) => {
    let date: Date | null = null; 
    let formattedDate: string | null = null; 
    
    if (selectedDay && selectedMonth && selectedYear) {
        date = new Date(`${selectedYear}-${selectedMonth}-${selectedDay}`)
        formattedDate = date.toLocaleDateString("en-US", {
            month: "long", 
            day: "numeric", 
            year: "numeric"
        })
    }

    const content: React.ReactNode = 
        todosChosen && todosToRender ?
        <div className="mb-[1rem] flex flex-col gap-[.5rem]">
            <p>So you've chosen to travel back in time to {formattedDate}!</p>
            <p>Check out the goals you made that day and how well you succeeded in accomplishing them</p>
            <p>Past Todos cannot be altered in any way but wise people learn from past experiences.</p>
        </div> : 
        <div className="mb-[1rem] flex flex-col gap-[.5rem]">
            <p>Welcome to History, where you can look back on the Todos you've made in the past.</p>
            <p>Just fill out the date picker and you can look back on past Todos, learn from them and make better goals in the future.</p>
        </div>


    return (
        content
    )
}

export default HistoryGreetingMsg; 