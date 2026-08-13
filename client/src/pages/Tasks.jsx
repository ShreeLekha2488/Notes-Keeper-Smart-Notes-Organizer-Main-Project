// Tasks.jsx Part 1/4

import React, { useEffect, useState } from "react";
import { CheckSquare, Search, X } from "lucide-react";
import API from "../services/api";
import GridView from "../components/GridView";

const Tasks = () => {

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  // ==========================================
  // Fetch Task Notes From MongoDB
  // GET /api/notes/tasks
  // ==========================================

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const { data } = await API.get("/notes/tasks");

      const taskData = data.tasks || data.notes || data || [];

      setTasks(taskData);

      setFilteredTasks(taskData);


    } catch (error) {

      console.error("Fetch Tasks Error:", error);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchTasks();

  }, []);



  // ==========================================
  // Search Task Notes
  // ==========================================

  useEffect(() => {

    if (!search.trim()) {

      setFilteredTasks(tasks);

      return;

    }


    const result = tasks.filter((task) =>

      task.title
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      task.content
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      task.description
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );


    setFilteredTasks(result);


  }, [search, tasks]);



  // ==========================================
  // Mark Task Completed
  // PUT /api/notes/:id/complete
  // ==========================================

  const handleComplete = async (id) => {

    try {

      await API.put(`/notes/${id}/complete`);

      fetchTasks();


    } catch (error) {

      console.error("Complete Task Error:", error);

    }

  };



  const clearSearch = () => {

    setSearch("");

  };



  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      <div className="max-w-7xl mx-auto">


        <div className="flex items-center gap-3 mb-6">

          <CheckSquare
            size={32}
            className="text-green-500"
          />


          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">

            Task Notes

          </h1>


        </div>


        <div className="relative max-w-xl mb-6">

          <Search
            className="absolute left-3 top-3 text-gray-500"
            size={20}
          />


          <input
            type="text"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-10 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
          />


          {search && (

            <button
              onClick={clearSearch}
              className="absolute right-3 top-3"
            >

              <X size={20}/>

            </button>

          )}

        </div>


        <div className="mt-6"></div>
        // Tasks.jsx Part 2/4


          <GridView

            notes={filteredTasks}

            loading={loading}


            onEdit={(note) => {

              console.log("Edit:", note);

            }}



            onPin={async (id) => {

              try {

                await API.patch(`/notes/${id}/pin`);

                fetchTasks();

              } catch (error) {

                console.error("Pin Error:", error);

              }

            }}



            onFavorite={async (id) => {

              try {

                await API.patch(`/notes/${id}/favorite`);

                fetchTasks();

              } catch (error) {

                console.error("Favorite Error:", error);

              }

            }}



            onArchive={async (id) => {

              try {

                await API.patch(`/notes/${id}/archive`);

                fetchTasks();

              } catch (error) {

                console.error("Archive Error:", error);

              }

            }}



            onTrash={async (id) => {

              try {

                await API.patch(`/notes/${id}/trash`);

                fetchTasks();

              } catch (error) {

                console.error("Trash Error:", error);

              }

            }}
// Tasks.jsx Part 3/4


            onComplete={handleComplete}


          />


        </div>


        {!loading && filteredTasks.length === 0 && (

          <div className="text-center mt-10">

            <p className="text-gray-600 dark:text-gray-400 text-lg">

              No task notes found

            </p>

          </div>

        )}


      </div>


  );

};
// Tasks.jsx Part 4/4

export default Tasks;