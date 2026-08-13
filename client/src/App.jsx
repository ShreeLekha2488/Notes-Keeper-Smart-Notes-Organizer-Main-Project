import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Favorites from "./pages/Favorites";
import Archive from "./pages/Archive";
import Trash from "./pages/Trash";
import Folders from "./pages/Folders";
import FolderNotes from "./pages/FolderNotes";
import Tags from "./pages/Tags";
import Pinned from "./pages/Pinned";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <Routes>

        {/* ==================================================
            DEFAULT
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ==================================================
            PUBLIC PAGES
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            NOTES
        ================================================== */}

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            PINNED
        ================================================== */}

        <Route
          path="/pinned"
          element={
            <ProtectedRoute>
              <Pinned />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            FOLDERS
        ================================================== */}

        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <Folders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/folders/:id"
          element={
            <ProtectedRoute>
              <FolderNotes />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            FAVORITES
        ================================================== */}

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ARCHIVE
        ================================================== */}

        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            TRASH
        ================================================== */}

        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            TAGS
        ================================================== */}

        <Route
          path="/tags"
          element={
            <ProtectedRoute>
              <Tags />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            SEARCH
        ================================================== */}

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            PROFILE
        ================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            SETTINGS
        ================================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            CHANGE PASSWORD
        ================================================== */}

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            UNKNOWN ROUTES
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;