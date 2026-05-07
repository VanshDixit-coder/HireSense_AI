import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailPage from './pages/JobDetailPage';
import ResumeManagerPage from './pages/ResumeManagerPage';
import ProfilePage from './pages/ProfilePage';

function AppLayout() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/jobs', element: <JobSearchPage /> },
          { path: '/jobs/:id', element: <JobDetailPage /> },
          { path: '/resume', element: <ResumeManagerPage /> },
          { path: '/profile', element: <ProfilePage /> }
        ]
      }
    ]
  }
]);

export default router;
