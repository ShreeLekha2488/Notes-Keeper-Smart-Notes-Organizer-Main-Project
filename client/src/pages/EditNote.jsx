// EditNote.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import {
  MdSave,
  MdArrowBack,
} from "react-icons/md";

const EditNote = () => {

  const { id } = useParams();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


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
  // Fetch Note From MongoDB
  // GET /api/notes/:id
  // ==========================================

  const fetchNote = async () => {

    try {

      const { data } = await API.get(`/notes/${id}`);


      const noteData = data.note || data;


      setNote({

        title: noteData.title || "",

        content: noteData.content || "",

        category: noteData.category || "",

        tags: noteData.tags || [],

        isFavorite: noteData.isFavorite || false,

        isPinned: noteData.isPinned || false,

        isTask: noteData.isTask || false,

        completed: noteData.completed || false,

      });


    } catch (error) {

      console.error("Fetch Note Error:", error);

    } finally {

      setLoading(false);

    }

  };




  useEffect(() => {

    fetchNote();

  }, [id]);






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
  // Update Note
  // PUT /api/notes/:id
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setSaving(true);


      await API.put(`/notes/${id}`, note);


      navigate(`/view-note/${id}`);


    } catch (error) {

      console.error("Update Note Error:", error);

    } finally {

      setSaving(false);

    }

  };







  if (loading) {

    return <Loader fullScreen />;

  }





  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">


      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">



        <div className="flex items-center justify-between mb-6">


          <button

            onClick={() => navigate(-1)}

            className="flex items-center gap-2 text-gray-600 dark:text-gray-300"

          >

            <MdArrowBack size={24}/>

            Back

          </button>



          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">

            Edit Note

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

            placeholder="Note title"

            className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white"

            required

          />







          <textarea

            name="content"

            value={note.content}

            onChange={handleChange}

            placeholder="Note content"

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







          <div className="flex items-center gap-4">



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

                checked={note.completed}

                onChange={(e) =>

                  setNote({

                    ...note,

                    completed: e.target.checked,

                  })

                }

              />


              Completed


            </label>



          </div>







          <button

            type="submit"

            disabled={saving}

            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

          >


            <MdSave size={22}/>


            {saving ? "Saving..." : "Save Changes"}


          </button>





        </form>


      </div>


    </div>

  );

};


export default EditNote;