import { useEffect, useState } from 'react'
import CreateTask from './components/CreateTask'
import ListTasks from './components/ListTasks'
import SearchBar from './components/SearchBar'
import { Toaster } from 'react-hot-toast'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  const [tasks, setTasks] = useState([])

  // Grab locally stored items (in JSON format) and set them to tasks state (filters out Null elements)
  useEffect(() => {
    const storedTasks = (JSON.parse(localStorage.getItem('tasks')));
    const validTasks = storedTasks.filter(task => task !== null);
    setTasks(validTasks)
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className='bg-slate-100 w-screen h-screen flex flex-col 
      items-center py-16 gap-16'>
        <SearchBar tasks = {tasks} setTasks = {setTasks}/>
        <CreateTask tasks = {tasks} setTasks = {setTasks}/>
        <ListTasks tasks = {tasks} setTasks = {setTasks}/>
      </div>
    </DndProvider>
  );
}

export default App
