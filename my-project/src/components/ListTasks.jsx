import { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import {  Draggable, Droppable, DragDropContext  } from "react-beautiful-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {

    const [todos, setTodos] = useState([])
    const [inProgress, setInProgress] = useState([])
    const [archived, setArchived] = useState([])

    console.log("tasks: ", tasks)

    useEffect(() => {
        // Check if tasks is null; if so, set to empty array
        if (tasks) {
            const filterTodos = tasks.filter((task) => task.status === "todo");
            const filterInProgress = tasks.filter((task) => task.status === "in-progress");
            const filterArchived = tasks.filter((task) => task.status === "archived");

            setTodos(filterTodos)
            setInProgress(filterInProgress)
            setArchived(filterArchived)
        }
    }, [tasks]);

    // Array of statuses
    const statuses = ["todo", "in-progress", "archived"]

    return (
    <div className="flex gap-16 pb-20">
        {statuses.map((status, index) => (
            <Section 
                key = {index} 
                status = {status} 
                tasks = {tasks} 
                setTasks = {setTasks}
                todos = {todos} 
                inProgress = {inProgress} 
                archived = {archived}
            />
        ))}
    </div>
    );
};

export default ListTasks;

const Section = ({ status, tasks, setTasks, todos, inProgress, archived }) => {
    
    // Function to drop a dragged item into a new section:
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item) => addItemToSection(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Format for Section Title:
    let text = "Todo";
    let bg = "bg-red-500"
    let tasksToMap = todos;

    if (status === "in-progress") {
        text = "In Progress";
        bg = "bg-orange-500"
        tasksToMap = inProgress;
    }

    if (status === "archived") {
        text = "Archived";
        bg = "bg-gray-500"
        tasksToMap = archived;
    }

    // Function to add dropped item to new Section in which I can move a task to any position within a section:
    const addItemToSection = (id) => {
        setTasks(prev => {
            const modifyTask = prev.map(task => {
                if (task.id === id) {
                    return {...task, status: status}
                }
                return task;
            })
            localStorage.setItem("tasks", JSON.stringify(modifyTask));
            toast("Task Moved", { icon: "👍" });
            return modifyTask
        });
    };

    // Return a Wrapper for Header and Task Component
    return (
        <div 
            ref = {drop}
            className={`w-96 ${isOver ? "bg-slate-200 p-5 mt-8 shadow-md rounded-md relative" : ""}`}
        >
            <Header text = {text} bg = {bg} count = {tasksToMap.length} />
            {tasksToMap.length > 0 && tasksToMap.map((task) => 
                <Task key = {task.id} task = {task} tasks = {tasks} setTasks = {setTasks}/>
            )}
        </div>
    );
};

const Header = ({ text, bg, count }) => {
    return (
        <div className= {`${bg} flex items-center h-12 pl-4 rounded-md uppercase
            text-sm text-white`}
        > 
            {text}
            <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex
                items-center justify-center">
                {count}
            </div>
        </div>
    );
};

const Task = ({task, tasks, setTasks }) => {

    if (!task) return null


    // Drag and Drop Hook from react-dnd
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: {id: task.id},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    // Function to remove task
    const handleRemove = (id) => {
        const filterTasks = tasks.filter(task => task.id !== id)
        localStorage.setItem("tasks", JSON.stringify(filterTasks));
        setTasks(filterTasks)
        toast("Task Removed", { icon: "❌" });
    };
    
    // Add Function to edit task, once clicked, allows users to edit the task's name and description
    const handleEdit = (id) => {
        const editTask = tasks.map(task => {
            if (task.id === id) {
                // Prompts creates Browser Pop-ups that allows users to enter new name and description
                let name = prompt("Enter new name", task.name);
                    if (name === null || name === "")
                        toast("Task must always have a Name", { icon: "👎" });
                        name = task.name;

                let description = prompt("Enter new description", task.description);
                    if (description === null)
                        description = task.description;

                return {...task, name: name, description: description}
            }
            return task;
        })
        localStorage.setItem("tasks", JSON.stringify(editTask));
        setTasks(editTask)
    };

    return (
        <div 
            ref = {drag} 
            className={`relative p-5 mt-8 shadow-md rounded-md 
                cursor-grab ${isDragging ? "opacity-25" : "opacity-100"}`}
        >
            <h1 className="font-bold">{task.name}</h1>
            <p className="px-3 mt-2">{task.description}</p>
            <button
                className="absolute bottom-3 right-12 text-slate-400"
                onClick={() => handleEdit(task.id)}
            > 
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    class="w-6 h-6"
                    >
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
                    />
                </svg>
            </button>
            <button 
                className="absolute bottom-3 right-3 text-slate-400" 
                onClick={()=> handleRemove(task.id)}
            >
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor" 
                class="w-6 h-6"
                >
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                    />
                </svg>
            </button>
        </div>
    );
};