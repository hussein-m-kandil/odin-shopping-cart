import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { authFormAction } from './components/AuthForm/auth-form-utils';
import AuthForm from './components/AuthForm/AuthForm';
import Guard from './components/AuthGuard/AuthGuard';
import App, { SIGNUP_PATH, SIGNIN_PATH, SIGNOUT_PATH } from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: SIGNUP_PATH,
        element: <AuthForm key={`${SIGNUP_PATH.replace('/', '')}-form`} />,
        action: authFormAction,
      },
      {
        path: SIGNIN_PATH,
        element: <AuthForm key={`${SIGNIN_PATH.replace('/', '')}-form`} />,
        action: authFormAction,
      },
      {
        element: <Guard authPath={SIGNIN_PATH} />,
        children: [
          { path: SIGNOUT_PATH, element: <App /> },
          { index: true, element: <h2 className="mt-16">Home</h2> },
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
