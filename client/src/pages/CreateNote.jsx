// CreateNote.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  MdSave,
  MdArrowBack,
} from "react-icons/md";


const CreateNote = () => {


  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);



  const [note, setNote] = useState({

    title: "",
    content: "",
    category: "",
    tags: [],
    isFavorite: false,
    isPinned: false,
    isTask: false,
    completed: false,

  });





  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;


    setNote((prev) => ({

      ...prev,

      [name]: value,

    }));

  };






  // ==========================================
  // Handle Tags
  // ==========================================

  const handleTags = (e) => {

    const value = e.target.value;


    setNote((prev) => ({

      ...prev,

      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),

    }));

  };







  // ==========================================
  // Create Note
  // POST /api/notes
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {


      setLoading(true);



      await API.post("/notes", note);



      navigate("/dashboard");



    } catch (error) {


      console.error("Create Note Error:", error);


    } finally {


      setLoading(false);


    }

  };







  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">


      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">



        <div className="flex justify-between items-center mb-6">


          <button

            onClick={() => navigate(-1)}

            className="flex items-center gap-2 text-gray-600 dark:text-gray-300"

          >

            <MdArrowBack size={24}/>

            Back

          </button>



          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">

            Create Note

          </h1>


        </div>







        <form

          onSubmit={handleSubmit}

          className="space-y-5"

        >





          <input

            type="text"

            name="title"

            value={note.title}

            onChange={handleChange}

            placeholder="Enter note title"

            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"

            required

          />








          <textarea

            name="content"

            value={note.content}

            onChange={handleChange}

            placeholder="Write your note..."

            rows="8"

            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"

            required

          />








          <select

            name="category"

            value={note.category}

            onChange={handleChange}

            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"

          >


            <option value="">

              Select Category

            </option>


            <option value="Personal">

              Personal

            </option>


            <option value="Work">

              Work

            </option>


            <option value="Study">

              Study

            </option>


            <option value="Ideas">

              Ideas

            </option>


          </select>







          <input

            type="text"

            placeholder="Tags (comma separated)"

            onChange={handleTags}

            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"

          />







          <div className="flex gap-6">



            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">


              <input

                type="checkbox"

                checked={note.isTask}

                onChange={(e) =>

                  setNote({

                    ...note,

                    isTask: e.target.checked,

                  })

                }

              />


              Task Note


            </label>






            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">


              <input

                type="checkbox"

                checked={note.isFavorite}

                onChange={(e) =>

                  setNote({

                    ...note,

                    isFavorite: e.target.checked,

                  })

                }

              />


              Favourite


            </label>






            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">


              <input

                type="checkbox"

                checked={note.isPinned}

                onChange={(e) =>

                  setNote({

                    ...note,

                    isPinned: e.target.checked,

                  })

                }

              />


              Pin


            </label>


          </div>







          <button

            type="submit"

            disabled={loading}

            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

          >

            <MdSave size={22}/>


            {loading ? "Saving..." : "Save Note"}


          </button>





        </form>




      </div>


    </div>

  );

};


export default CreateNote;