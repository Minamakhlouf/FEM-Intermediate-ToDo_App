type ToDoProps = {
    text: string, 
    id: string, 
    isActive: boolean,
    currentViewIsAll?: boolean, 
    onIsActiveChange: (toDoID: string, currentStatus: boolean) => Promise<void>, 
    onPendingDeleteToDo: (toDoID: string) => void; 
}

const ToDo = ({text, id, isActive, currentViewIsAll, onIsActiveChange, onPendingDeleteToDo}: ToDoProps) => {
    let isActiveCSSBtn: string = ""; 
    let isActiveCSSText: string = ""; 

    
    if (!isActive) {
        isActiveCSSBtn = "bg-[linear-gradient(135deg,#55DDFF,#C058F3)]"; 
        isActiveCSSText = "text-[#D1D2DA] line-through"
    }

    return (
        <div className="py-[1rem] px-[1.25rem] flex items-center gap-[0.75rem] border-b border-b-[#E3E4F1] dark:border-b-[hsl(233,14%,35%)]">
            <button onClick={() => {onIsActiveChange(id, isActive)}} className={`group w-[1.25rem] md:w-[1.5rem] aspect-square rounded-full border border-[#E3E4F1] cursor-pointer hover:bg-[linear-gradient(135deg,#55DDFF,#C058F3)] flex justify-center items-center ${isActiveCSSBtn} shrink-0`}>
                <img className={`opacity-100 ${!isActive ? "dark:opacity-[1]" : "dark:opacity-[0]"} group-hover:opacity-[1]`} src="images/icon-check.svg" alt="checkmark"/>
            </button>
            <span className={`${isActiveCSSText} ${currentViewIsAll?"cursor-pointer":""}`}>{text}</span>
            <button onClick={() => {onPendingDeleteToDo(id)}} className="w-[.75rem] md:w-[1.125rem] aspect-square ml-auto cursor-pointer shrink-0">
                <img src="images/icon-cross.svg" alt="X" />
            </button>
        </div>
    )
}

export default ToDo; 