// ViewNote.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import {
  MdArrowBack,
  MdEdit,
  MdFavorite,
  MdFavoriteBorder,
  MdPushPin,
  MdPushPinOutlined,
} from "react-icons/md";

const ViewNote = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);



  // ==========================================
  // Fetch Single Note From MongoDB
  // GET /api/notes/:id
  // ==========================================

  const fetchNote = async () => {

    try {

      const { data } = await API.get(`/notes/${id}`);

      setNote(data.note || data);


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
  // Toggle Favourite
  // PATCH /api/notes/:id/favorite
  // ==========================================

  const handleFavorite = async () => {

    try {

      await API.patch(`/notes/${id}/favorite`);

      fetchNote();


    } catch (error) {

      console.error("Favorite Error:", error);

    }

  };





  // ==========================================
  // Toggle Pin
  // PATCH /api/notes/:id/pin
  // ==========================================

  const handlePin = async () => {

    try {

      await API.patch(`/notes/${id}/pin`);

      fetchNote();


    } catch (error) {

      console.error("Pin Error:", error);

    }

  };





  if (loading) {

    return <Loader fullScreen />;

  }



  if (!note) {

    return (

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">

        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">

          Note not found

        </h2>

      </div>

    );

  }





  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">


      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">


        <div className="flex justify-between items-center mb-6">


          <button

            onClick={() => navigate(-1)}

            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500"

          >

            <MdArrowBack size={24}/>

            Back

          </button>




          <div className="flex gap-3">


            <button

              onClick={handlePin}

              className="text-yellow-500 hover:scale-110 transition"

            >

              {note.isPinned ? (

                <MdPushPin size={28}/>

              ) : (

                <MdPushPinOutlined size={28}/>

              )}

            </button>




            <button

              onClick={handleFavorite}

              className="text-red-500 hover:scale-110 transition"

            >

              {note.isFavorite ? (

                <MdFavorite size={28}/>

              ) : (

                <MdFavoriteBorder size={28}/>

              )}

            </button>




            <button

              onClick={() => navigate(`/edit-note/${note._id}`)}

              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"

            >

              <MdEdit/>

              Edit

            </button>


          </div>


        </div>





        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">

          {note.title}

        </h1>





        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-lg">

          {note.content}

        </p>





        <div className="mt-6 flex flex-wrap gap-3">


          {note.category && (

            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">

              {note.category}

            </span>

          )}



          {note.tags?.map((tag) => (

            <span

              key={tag}

              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"

            >

              #{tag}

            </span>

          ))}


        </div>





        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">


          Created:

          {" "}

          {new Date(note.createdAt).toLocaleDateString()}


        </div>



      </div>


    </div>

  );

};


export default ViewNote;