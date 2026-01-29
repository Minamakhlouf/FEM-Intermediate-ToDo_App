import ButtonEvent from "./ButtonEvent";

type ModalProps = {
    stateValue: string; 
    updateState: React.Dispatch<React.SetStateAction<string>>
    confirmAction: (() => void) | (() => Promise<void>); 
}

const Modal = ({stateValue, confirmAction, updateState}: ModalProps) => {
    let msg; 

    const onConfirmDeletion = () => {
        confirmAction(); 
        updateState(""); 
    }

    if (stateValue === "Clear Completed") {
        msg = "Deleting this To Do will result in it being permanently deleted from our database. It will not be available for you to review in the future."
    } else {
        msg = "Clearing completed To Dos will result in their permanent deletion from our databases. If you want an accurate description of what you've done on this day in the future, it will obscure the results"
    }

    const backdropExitModal = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); 
        updateState("")
    }

    return (
        <div onClick={backdropExitModal} className={`absolute inset-0 bg-black/70 flex justify-center content-center flex-wrap z-10`}>
            <div className={`bg-white p-[6rem] text-center max-w-lg`}>
                <h2 className="text-3xl mb-[1rem]">Are you sure?</h2>
                <p className="mb-[1.5rem]">{msg}</p>
                <div className="flex gap-[.5rem] justify-center">
                    <ButtonEvent text="Delete it" onClickHandler={onConfirmDeletion}/>
                    <ButtonEvent text="Never mind" onClickHandler={() => {updateState("")}}/>
                </div>
            </div>
        </div>
    )
}

export default Modal; 