import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { authFormAction } from './components/AuthForm/auth-form-utils';
import App, {
  CART_PATH,
  SIGNUP_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  PROFILE_PATH,
  WISHLIST_PATH,
  CATEGORY_PATH,
  CATEGORIES_PATH,
} from './App';
import Categories from './components/Categories/Categories';
import Wishlist from './components/Wishlist/Wishlist';
import AuthForm from './components/AuthForm/AuthForm';
import Guard from './components/AuthGuard/AuthGuard';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import PageTitle from './PageTitle';
import notFoundImg from './assets/images/not-found.svg';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    ErrorBoundary: () => {
      return (
        <div className="h-screen flex flex-col justify-center text-center">
          <p className="text-xl font-bold">Sorry, something went wrong!</p>
          <Link
            to="/"
            replace={true}
            className="text-blue-700 underline visited:text-purple-700 text-sm"
          >
            Back to Home
          </Link>
        </div>
      );
    },
    children: [
      {
        index: true,
        element: <Home key="home" />,
      },
      {
        path: `${CATEGORY_PATH}/:category`,
        element: <Home key="category" />,
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
        path: CATEGORIES_PATH,
        element: (
          <>
            <PageTitle pageTitle="Categories" />
            <Categories />
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
        ],
      },
      {
        path: '*',
        Component: () => (
          <img src={notFoundImg} alt="Not Found" className="mx-auto" />
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
