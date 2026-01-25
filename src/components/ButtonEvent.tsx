type ButtonEventProps = {
    text: string; 
    onClickHandler: () => void; 
}

const ButtonEvent = ({text, onClickHandler}:ButtonEventProps) => {
    const buttonStyles = `text-xs md:text-lg py-1 px-3 md:px-4 cursor-pointer bg-[hsl(252,50%,42%)] hover:bg-[hsl(252,50%,36%)] dark:bg-[hsl(255,65%,62%)] dark:hover:bg-[hsl(255,65%,56%)] text-[#FFFFFF] px-[1rem] py[.5rem] rounded-md`

    return (
        <button className={buttonStyles} onClick={onClickHandler}>{text}</button>
    )
}

export default ButtonEvent; 