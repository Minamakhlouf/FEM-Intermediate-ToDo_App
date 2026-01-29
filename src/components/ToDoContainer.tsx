import ToDo from "./ToDo";
import CurrentViewBtn from "./CurrentViewBtn";
import Modal from "./Modal";
import { useState } from "react";
import { db, auth } from "../firebase"
import { doc, updateDoc, deleteDoc, collection, where, getDocs, query } from "firebase/firestore"; 
import { Reorder } from "motion/react";
import { type Todo } from "../sharedTypes"

type ToDoContainerProps = { 
    todos: Todo[], 
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>> 
};

type CurrentViewType = "All" | "Active" | "Completed"

const ToDoContainer = ({todos, setTodos}: ToDoContainerProps) => {
    const [currentView, setCurrentView] = useState<CurrentViewType>("All"); 
    const [pendingToDoDeletion, setPendingToDoDeletion] = useState<string>(""); 

    let filteredToDos: Todo[] = []; 
    let emptyArrayMessage: string; 

    if (currentView === "Completed") {
        filteredToDos = todos.filter(todo => todo.isActive === false); 
        emptyArrayMessage = "Completed ToDos either don't exist or have been cleared."
    } else if (currentView === "Active") {
        filteredToDos = todos.filter(todo => todo.isActive === true); 
        emptyArrayMessage = "There are no active ToDos"
    } else {
        filteredToDos = todos; 
        emptyArrayMessage = "Your ToDo list is empty. Let's make some goals."
    }

    const toggleCompleteToDo = async (toDoID: string, currentStatus: boolean) => {
        await updateDoc(doc(db, "todos", toDoID), {
            isActive: !currentStatus
        }); 
    }

    const deleteToDo = async (toDoID: string) => {
        await deleteDoc(doc(db, "todos", toDoID)); 
    }

    const pendingDeleteToDo = (id:string) => {
        setPendingToDoDeletion(id)
    }

    const clearCompleted = async () => {
        const uid = auth.currentUser?.uid; 
        const dayKey = new Date().toLocaleDateString("en-CA"); 

        const q = query(
            collection(db, "todos"),
            where("uid", "==", uid),
            where("dayKey", "==", dayKey),
            where("isActive", "==", false)
        );

        const snap = await getDocs(q);
        if (snap.empty) return;

        const promises = snap.docs.map(d => deleteDoc(d.ref));
        await Promise.all(promises); // faster than a "for await" loop
    };

    const persistOrder = async (newTodos: Todo[]) => {
        // Rewrite the order field based on the new array positions
        await Promise.all(
            newTodos.map((todo, index) =>
            updateDoc(doc(db, "todos", todo.id), { order: index })
            )
        );
    };

    const handleReorder = (newTodos: Todo[]) => {
    // 1) update local state (in App, via setTodos)
    setTodos(newTodos);

    // 2) persist to Firestore (don't await in the render path)
    void persistOrder(newTodos);
    };

    return (
        <>
        <section className="sm:shadow-lg rounded-lg mb-[2.5rem] sm:mb-[3rem]">
            <div className="bg-white dark:bg-[hsl(235,24%,19%)] rounded-lg">
                {
                    filteredToDos.length === 0 ? (
                        <div className="text-center p-[16px] bg-[white] mt-[-28px] max-w-[33.75rem] mx-auto bg-white rounded-md">
                            <span>{emptyArrayMessage}</span>
                        </div>
                    ) : currentView === "All" ? (
                        <Reorder.Group axis="y" values={todos} onReorder={handleReorder}>
                        {todos.map((todo) => (
                            <Reorder.Item key={todo.id} value={todo}>
                            <ToDo
                                id={todo.id}
                                isActive={todo.isActive}
                                text={todo.text}
                                onIsActiveChange={toggleCompleteToDo}
                                onPendingDeleteToDo={pendingDeleteToDo}
                                currentViewIsAll={currentView==="All"}
                            />
                            </Reorder.Item>
                        ))}
                        </Reorder.Group>
                    ) : (
                        <ul>
                        {filteredToDos.map((todo) => (
                            <li key={todo.id}>
                            <ToDo
                                id={todo.id}
                                isActive={todo.isActive}
                                text={todo.text}
                                onIsActiveChange={toggleCompleteToDo}
                                onPendingDeleteToDo={pendingDeleteToDo}
                            />
                            </li>
                        ))}
                        </ul>
                    )
                }
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-y-[1rem] sm:grid-rows-1 sm:grid-cols-4">
                <span className="py-[1rem] text-xs sm:text-sm bg-white dark:bg-[hsl(235,24%,19%)] px-[1.25rem] shadow-md sm:shadow-none">{todos.filter(todo => todo.isActive === true).length} items left</span>
                <div className="flex gap-[1.125rem] col-span-2 justify-center sm:col-start-2 sm:row-start-1 bg-white dark:bg-[hsl(235,24%,19%)] px-[1.25rem] shadow-lg sm:shadow-none">
                    <CurrentViewBtn currentState={currentView} view="All" changeCurrentView={setCurrentView}/>
                    <CurrentViewBtn currentState={currentView} view="Active" changeCurrentView={setCurrentView}/>
                    <CurrentViewBtn currentState={currentView} view="Completed" changeCurrentView={setCurrentView}/>
                </div>
                <div className="py-[1rem] col-start-2 row-start-1 flex justify-end sm:col-start-4 bg-white dark:bg-[hsl(235,24%,19%)] px-[1.25rem] px-[1.25rem] sm:px-[0] sm:pr-[1.25rem] shadow-md sm:shadow-none">
                    <button onClick={() => setPendingToDoDeletion("Clear Completed")} className="text-xs sm:text-sm cursor-pointer">Clear Completed</button>
                </div>
            </div>
        </section>
        <div className="text-center text-[.875rem]"><span className="text-sm">Drag and Drop: </span> {currentView === "All" ? <span className="text-[#3A7CFD] text-[.875rem] font-semibold">Enabled</span> : <span className="text-[#3A7CFD] text-[.875rem] font-semibold">Disabled</span>}</div>
        {
            pendingToDoDeletion && 
            <Modal
                stateValue={pendingToDoDeletion}
                updateState={setPendingToDoDeletion}
                confirmAction={pendingToDoDeletion === "Clear Completed" ? clearCompleted : () => {deleteToDo(pendingToDoDeletion)}}
            />
        }
        </>
    )
}

export default ToDoContainer; 