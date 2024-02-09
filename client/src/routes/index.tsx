import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Root from './Root';
import Chat from './Chat';
import ChatRoute from './ChatRoute';
import AssistantsRoute from './AssistantsRoute';
import Search from './Search';
import AdminRoot from './AdminRoot';
import Users from '~/components/Admin/Users';
import {
  Login,
  Registration,
  RequestPasswordReset,
  ResetPassword,
  ApiErrorWatcher,
} from '~/components/Auth';
import { AuthContextProvider } from '~/hooks/AuthContext';
import { Dashboard } from '~/components/Admin';

const AuthLayout = () => (
  <AuthContextProvider>
    <Outlet />
    <ApiErrorWatcher />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: 'register',
    element: <Registration />,
  },
  {
    path: 'forgot-password',
    element: <RequestPasswordReset />,
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/c/new" replace={true} />,
          },
          {
            path: 'c/:conversationId?',
            element: <ChatRoute />,
          },
          {
            path: 'chat/:conversationId?',
            element: <Chat />,
          },
          {
            path: 'a/:conversationId?',
            element: <AssistantsRoute />,
          },
          {
            path: 'search/:query?',
            element: <Search />,
          },
        ],
      },
      {
        path: 'admin/',
        element: <AdminRoot />,
        children: [
          // {
          //   index: true,
          //   element: <Navigate to="dashboard" replace={true} />,
          // },
          // TODO: index route setting(Dashboard)
          {
            path: 'dashboard/',
            element: <Dashboard />,
          },
          {
            path: 'users/',
            element: <Users />,
          },
        ],
      },
    ],
  },
]);
