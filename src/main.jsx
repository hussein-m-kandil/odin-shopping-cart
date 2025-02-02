import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { authFormAction } from './components/AuthForm/auth-form-utils';
import App, { SIGNUP_PATH, SIGNIN_PATH, SIGNOUT_PATH } from './App';
import AuthForm from './components/AuthForm/AuthForm';
import Guard from './components/AuthGuard/AuthGuard';
import PageTitle from './PageTitle';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: SIGNUP_PATH,
        element: (
          <>
            <PageTitle pageTitle="Sign up" />
            <AuthForm key="signup-form" />
          </>
        ),
        action: authFormAction,
      },
      {
        path: SIGNIN_PATH,
        element: (
          <>
            <PageTitle pageTitle="Sign in" />
            <AuthForm key="signin-form" />
          </>
        ),
        action: authFormAction,
      },
      {
        element: <Guard authPath={SIGNIN_PATH} />,
        children: [
          {
            path: SIGNOUT_PATH,
            element: (
              <>
                <PageTitle pageTitle="Sign out" />
                <App />
              </>
            ),
          },
          {
            index: true,
            element: (
              <>
                <PageTitle pageTitle="Home" />
                <h2 className="mt-16">Home</h2>
              </>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
