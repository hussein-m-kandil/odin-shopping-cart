import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { authFormAction } from './components/AuthForm/auth-form-utils';
import App, {
  CART_PATH,
  SIGNUP_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  CHECKOUT_PATH,
  WISHLIST_PATH,
  PROFILE_PATH,
} from './App';
import Wishlist from './components/Wishlist/Wishlist';
import AuthForm from './components/AuthForm/AuthForm';
import Guard from './components/AuthGuard/AuthGuard';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import PageTitle from './PageTitle';
import Profile from './components/Profile/Profile';

// TODO: Add error element and not-found route

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <>
            <PageTitle pageTitle="Home" />
            <Home />
          </>
        ),
      },
      {
        path: CART_PATH,
        element: (
          <>
            <PageTitle pageTitle="Cart" />
            <Cart />
          </>
        ),
      },
      {
        path: WISHLIST_PATH,
        element: (
          <>
            <PageTitle pageTitle="Wishlist" />
            <Wishlist />
          </>
        ),
      },
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
          { path: PROFILE_PATH, element: <Profile /> },
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
            path: CHECKOUT_PATH,
            element: (
              <>
                <PageTitle pageTitle="Checkout" />
                <h2>Checkout</h2>
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
