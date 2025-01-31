import { Outlet, useMatch } from 'react-router-dom';
import { getSigninValidation, getSignout } from './services/auth';
import Navbar from './components/Navbar/Navbar';
import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const AUTH_DATA_KEY = 'seco_seco';
export const SIGNUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const SIGNOUT_PATH = '/signout';

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [authData, setAuthData] = useState(parsedAuthData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parsedAuthData) {
      getSigninValidation(parsedAuthData['user-token'])
        .then(({ data, error }) => {
          if (parsedAuthData) {
            // So, the component still mounted!
            if (data === true) {
              return setErrorMessage(null);
            }
            throw data ? new Error('Authentication failed!') : error;
          }
        })
        .catch((error) => {
          setAuthData(null);
          setErrorMessage(error.message);
        })
        .finally(() => parsedAuthData && setLoading(false));
      return () => (parsedAuthData = null);
    }
    setLoading(false);
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
      <div className={`${errorMessage ? '' : 'hidden'}`} role="alert">
        {errorMessage || ''}
      </div>
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
