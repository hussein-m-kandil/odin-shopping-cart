import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';
import { getSigninValidation, getSignout } from './services/auth';
import Navbar from './components/Navbar/Navbar';

const LOCALE_STORAGE_ERR_MSG =
  'Oh no, amnesia! We may not remember you in subsequent visits.';
const AUTH_DATA_KEY = 'seco_seco';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const oldAuthData = localStorage.getItem(AUTH_DATA_KEY);
      if (oldAuthData) {
        // Set it into the state to trigger the validation effect
        return setAuthData(JSON.parse(oldAuthData));
      }
    } catch {
      setErrorMessage(LOCALE_STORAGE_ERR_MSG);
    }
    // So, no validation will be requested!
    setLoading(false);
  }, []);

  useEffect(() => {
    // Trigger user token validation on every change to its state
    if (authData) {
      let stillMounted = true;
      getSigninValidation(authData['user-token'])
        .then(({ data, error }) => {
          if (stillMounted) {
            if (data === true) {
              setErrorMessage(null);
              return;
            }
            setAuthData(null);
            if (data) throw new Error(data);
            else setErrorMessage(error.message);
          }
        })
        .catch(() => {
          setErrorMessage('Authentication failed! You may have to sign in.');
        })
        .finally(() => stillMounted && setLoading(false));
      return () => (stillMounted = false);
    }
  }, [authData]);

  const authenticate = (newAuthData) => {
    if (newAuthData && newAuthData['user-token']) {
      setAuthData(newAuthData);
      try {
        localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(newAuthData));
      } catch {
        setErrorMessage(LOCALE_STORAGE_ERR_MSG);
      }
    }
  };

  const signout = () => {
    setAuthData(null);
    try {
      getSignout(authData['user-token']);
      localStorage.removeItem(AUTH_DATA_KEY);
    } catch (error) {
      console.log(error);
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
        <div aria-label="Loading">
          <BiLoader />
        </div>
      ) : (
        <Outlet context={{ authenticate, signout, authenticated }} />
      )}
    </>
  );
}

export default App;
