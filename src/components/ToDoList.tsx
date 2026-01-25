import { useState } from "react";
import { Reorder } from "motion/react";

type ToDoListProps = {
    ids: string[]
}

const ToDoList = ({ids}: ToDoListProps) => {
    const [items, setItems] = useState([...ids])

    return (
        <Reorder.Group axis="y" values={items} onReorder={setItems}>
            {items.map(item => 
                <Reorder.Item key={item} value={item}>{item}</Reorder.Item>
            )}
        </Reorder.Group>
    )
}

export default ToDoList; 