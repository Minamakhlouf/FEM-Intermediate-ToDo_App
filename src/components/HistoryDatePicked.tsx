import type { Todo } from "../sharedTypes"
import ButtonEvent from "./ButtonEvent"

type HistoryDatePickedProps = {
    todosToRender: Todo[] | null; 
    onExitHistory: () => void; 
    onChangeDate: () => void; 
}

const HistoryDatePicked = ({todosToRender, onExitHistory, onChangeDate}: HistoryDatePickedProps) => {
    return (
        <div>
            <ul>
                <li className="grid grid-cols-[2rem_1fr_1fr] py-[.25rem] border-b border-b-[#E3E4F1] dark:border-b-[hsl(233,14%,35%)]">
                    <span className="font-bold default-text">#</span>
                    <span className="font-bold default-text">To Do</span>
                    <span className="font-bold default-text">Status</span>
                </li>
                {todosToRender!.map((todo, index) => {
                    return (
                        <li className="grid grid-cols-[2rem_1fr_1fr] py-[.25rem] border-b border-b-[#E3E4F1] dark:border-b-[hsl(233,14%,35%)]" key={todo.id}>
                            <span className="font-bold default-text">{index + 1}</span>
                            <span className="default-text">{todo.text}</span>
                            <span className="default-text">{todo.isActive ? "Incomplete" : "Complete"}</span>
                        </li>
                    )
                })}
            </ul>
            <div className="mt-[1rem] flex gap-[1rem]">
                <ButtonEvent text="Change Date" onClickHandler={onChangeDate}/>
                <ButtonEvent  text="Exit History" onClickHandler={onExitHistory}/>
            </div>
        </div>
    )
}

export default HistoryDatePicked; 