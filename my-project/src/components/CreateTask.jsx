import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from 'react-hot-toast'
import Modal from 'react-modal'

// Component for creating a new task

Modal.setAppElement('#root');

const ModalStyles = {
    content: {
        width: '50%',
        height: '50%',
        margin: 'auto',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
};

const CreateTask = ({tasks, setTasks}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [task, setTask] = useState({
        id: '',
        index: '',
        name: '',
        description: '',
        status: "todo" // Can be switched to "in-progress" or "completed"
    });

    // Function to update the task state with new task:
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if task name is too small or too large; returns Error if True
        if (task.name.length < 3) 
            return toast.error("A task must be at least 3 characters long")
        
        if (task.name.length > 100) 
            return toast.error("A task must be at most 100 characters long")

        setTasks((prev) => {
            const list = [...prev, task];
            // Save Task State to Local Storage
            localStorage.setItem("tasks", JSON.stringify(list));
            return list;
        });

        toast.success("Task Created")

        // Return Task State to Default 
        setModalIsOpen(false);
        setTask({
            id: '',
            index: '',
            name: '',
            description: '',
            status: "todo"
        })
    };

    return (
        <div>
            <button className="bg-cyan-500 rounded-md px-4 h-12 text-white hover:bg-cyan-700" 
                onClick = {() => setModalIsOpen(true)}> Add Task </button>
            <Modal // Modal for Creating a New Task
                isOpen = {modalIsOpen} 
                style = {ModalStyles}
                onRequestClose = {() => setModalIsOpen(false)}
            >
                <h2 className="font-bold mb-6">
                    Create a New Task
                </h2>
                <form onSubmit = {handleSubmit}>
                    <label className="mr-2"> 
                        Title:
                        </label> 
                        <input type="text" className="border-2 border-slate-400 bg-slate-100
                            rounded-md mr-4 h-12 w-64 px-1 mb-10"
                            value = {task.name}
                            onChange = {(e) => 
                                // UUID generates a random, but uniuqe ID
                                setTask({...task, id: uuidv4(),  name: e.target.value})
                            }
                        />
                    <br />
                    <h2 className="mb-2 text-center">
                        Description
                        </h2>
                        <textarea name = "description" rows = "3" className="border-2 border-slate-400 bg-slate-100 block rounded-lg w-full text-sm"
                            value={task.description}
                            onChange = {(e) =>
                                setTask({...task, description: e.target.value})
                            }
                        />

                    <br />
                    <button className="bg-cyan-500 rounded-m px-4 h-12 text-white justify-center mt-6 items-center rounded hover:bg-cyan-700">
                        Create
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default CreateTask;