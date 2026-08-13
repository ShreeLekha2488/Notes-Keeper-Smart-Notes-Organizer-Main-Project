import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Notes from "../pages/Notes";
import Folders from "../pages/Folders";
import FolderNotes from "../pages/FolderNotes";
import Tags from "../pages/Tags";
import Favorites from "../pages/Favorites";
import Archive from "../pages/Archive";
import Trash from "../pages/Trash";
import Search from "../pages/Search";
import Pinned from "../pages/Pinned";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import ChangePassword from "../pages/ChangePassword";
import CreateNote from "../pages/CreateNote";
import EditNote from "../pages/EditNote";
import ViewNote from "../pages/ViewNote";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          ROOT
      ========================= */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* =========================
          PUBLIC
      ========================= */}

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* =========================
          DASHBOARD
      ========================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          NOTES
      ========================= */}

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-note"
        element={
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-note/:id"
        element={
          <ProtectedRoute>
            <EditNote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-note/:id"
        element={
          <ProtectedRoute>
            <ViewNote />
          </ProtectedRoute>
        }
      />

      {/* =========================
          FOLDERS
      ========================= */}

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

      {/* =========================
          TAGS
      ========================= */}

      <Route
        path="/tags"
        element={
          <ProtectedRoute>
            <Tags />
          </ProtectedRoute>
        }
      />

      {/* =========================
          FAVORITES
      ========================= */}

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ARCHIVE
      ========================= */}

      <Route
        path="/archive"
        element={
          <ProtectedRoute>
            <Archive />
          </ProtectedRoute>
        }
      />

      {/* =========================
          TRASH
      ========================= */}

      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <Trash />
          </ProtectedRoute>
        }
      />

      {/* =========================
          SEARCH
      ========================= */}

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />

      {/* =========================
          PINNED
      ========================= */}

      <Route
        path="/pinned"
        element={
          <ProtectedRoute>
            <Pinned />
          </ProtectedRoute>
        }
      />

      {/* =========================
          TASKS
      ========================= */}

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      {/* =========================
          PROFILE
      ========================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* =========================
          CHANGE PASSWORD
      ========================= */}

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* =========================
          SETTINGS
      ========================= */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;