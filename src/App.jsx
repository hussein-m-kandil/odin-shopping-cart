import { getSigninValidation, getSignout } from './services/auth';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { Outlet, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import Navbar from './components/Navbar/Navbar';

export const HOME_PATH = '/';
export const CART_PATH = '/cart';
export const BRANDS_PATH = '/brands';
export const SIGNUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const SIGNOUT_PATH = '/signout';
export const PRODUCTS_PATH = '/products';
export const CATEGORIES_PATH = '/categories';
const AUTH_DATA_KEY = 'seco_seco';

let parsedAuthData = null;
try {
  const serializedAuthData = localStorage.getItem(AUTH_DATA_KEY);
  if (serializedAuthData) {
    parsedAuthData = JSON.parse(serializedAuthData);
  }
} catch (error) {
  console.log(error);
}

function App() {
  const [authData, setAuthData] = useState(parsedAuthData);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parsedAuthData) {
      getSigninValidation(parsedAuthData['user-token'])
        .then(({ data, error }) => {
          if (data === true) return setErrorMessage(null);
          throw error || new Error('Authentication failed!');
        })
        .catch((error) => {
          setAuthData(null);
          setErrorMessage(error.message);
        })
        .finally(() => {
          parsedAuthData = null;
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signoutPathMatch = useMatch(SIGNOUT_PATH);

  useEffect(() => {
    if (authData && signoutPathMatch) {
      try {
        localStorage.removeItem(AUTH_DATA_KEY);
      } catch (error) {
        console.log(error);
      } finally {
        setAuthData(null);
        // Just send a sign out request, no need to process the response!
        getSignout(authData['user-token']);
      }
    }
  }, [signoutPathMatch, authData]);

  useEffect(() => {
    if (errorMessage) {
      toast(errorMessage, {
        type: 'error',
        autoClose: 3000,
        transition: Slide,
      });
    }
  }, [errorMessage]);

  const authenticate = (newAuthData) => {
    setAuthData(newAuthData);
    try {
      localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(newAuthData));
    } catch {
      setErrorMessage('Storing authentication data failed!');
    }
  };

  const authenticated = Boolean(authData);

  return (
    <>
      <Navbar authenticated={authenticated} />
      <ToastContainer />
      {loading ? (
        <div className="min-h-screen flex flex-col justify-center items-center text-4xl text-app-main">
          <BiLoaderAlt title="Loading..." className="animate-spin" />
        </div>
      ) : (
        <Outlet context={{ authData, authenticated, authenticate }} />
      )}
    </>
  );
}

export default App;
