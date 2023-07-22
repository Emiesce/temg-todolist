// Add a Function Search Bar that hides out all tasks that do not match the search query, 
// they return after the query is deleted (this is the prompt for GitHub Copilot):

import { useState, useEffect } from "react";

const SearchBar = ({ tasks, setTasks }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        let filteredTasks = [];
        // If Search Query is empty, set filteredTasks to all tasks
            if (searchQuery === "") {
                const storedTasks = JSON.parse(localStorage.getItem("tasks"));
                filteredTasks.push(storedTasks);
            } else {
                // If Search Query is not empty, filter tasks by search query
                let searchQueries = searchQuery.split(" ");
                let tempTasks = JSON.parse(localStorage.getItem("tasks"));
                searchQueries.forEach((q) => {
                    // Filter tasks by name and description
                    tempTasks = tempTasks.filter((task) =>
                        task.name.toLowerCase().includes(q.toLowerCase()) ||
                        task.description.toLowerCase().includes(q.toLowerCase())
                    );
                    // Push filtered tasks to filteredTasks array
                    filteredTasks.push(tempTasks);
                    tempTasks = JSON.parse(localStorage.getItem("tasks"));
                });
            }
        // Set tasks to last element of filteredTasks array
        setTasks(filteredTasks[filteredTasks.length - 1]);
        setFilteredTasks(filteredTasks);
      }, [searchQuery]);

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="text"
                placeholder="Search Keywords..."
                className="w-80 h-10 rounded-md px-4"
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchBar;