import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Friends from './pages/Friends';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/landing" replace />;
}

function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  const { isAuthenticated, isGuest } = useAuth();
  const hasAccess = isAuthenticated || isGuest;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Routes>
        {/* Landing */}
        <Route path="/landing" element={
          hasAccess ? <Navigate to="/" replace /> : (
            <><Navbar variant="landing" /><Landing /></>
          )
        } />

        {/* Auth (full-screen, no navbar) */}
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/signin" element={<AuthRoute><SignIn /></AuthRoute>} />

        {/* Feed — accessible to guests (read-only) and authenticated */}
        <Route path="/" element={
          hasAccess ? <><Navbar /><Feed /></> : <Navigate to="/landing" replace />
        } />

        {/* Friends — authenticated only */}
        <Route path="/friends" element={
          <ProtectedRoute><Navbar /><Friends /></ProtectedRoute>
        } />

        {/* Profile — viewable by guests and authenticated */}
        <Route path="/profile/:username" element={
          hasAccess ? <><Navbar /><Profile /></> : <Navigate to="/landing" replace />
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={hasAccess ? "/" : "/landing"} replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
