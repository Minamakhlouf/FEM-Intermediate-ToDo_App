type CurrentViewBtnProps = {
    view: "All" | "Active" | "Completed", 
    currentState: string, 
    changeCurrentView: React.Dispatch<React.SetStateAction<"All" | "Active" | "Completed">>
};

const CurrentViewBtn = ({view, currentState, changeCurrentView}: CurrentViewBtnProps) => {
    let textColor: string = "text-[#9495A5] hover:text-[#494C6B] hover:font-bold dark:text-[#5B5E7E] dark:hover:text-[#E3E4F1]"

    if (view === currentState) {
        textColor = "text-[#3A7CFD] font-bold"
    }

    const onViewChange = () => {
        changeCurrentView(view); 
    }

    return (
        <button onClick={onViewChange} className={`text-sm ${textColor} cursor-pointer`}>{view}</button>
    )
}

export default CurrentViewBtn; 