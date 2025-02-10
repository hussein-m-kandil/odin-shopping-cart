import { Slide, toast, ToastContainer } from 'react-toastify';
import { Outlet, ScrollRestoration, useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as authServices from './services/auth';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './Loader';

export const HOME_PATH = '/';
export const CART_PATH = '/cart';
export const BRANDS_PATH = '/brands';
export const SIGNUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const PROFILE_PATH = '/profile';
export const SIGNOUT_PATH = '/signout';
export const WISHLIST_PATH = '/wishlist';
export const PRODUCTS_PATH = '/products';
export const CHECKOUT_PATH = '/checkout';
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
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (parsedAuthData) {
      authServices
        .getSigninValidation(parsedAuthData['user-token'])
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
        authServices.getSignout(authData['user-token']);
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

  const deleteUser = () => {
    authServices
      .deleteUser(authData.objectId)
      .then(({ data }) => {
        if (!data) throw Error('Account Deletion Failed!');
        try {
          localStorage.removeItem(AUTH_DATA_KEY);
        } catch (error) {
          console.log(error);
        } finally {
          setAuthData(null);
        }
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const authenticated = Boolean(authData);

  const updateCart = (product, quantity) => {
    if (quantity > 0) {
      let existedItem = false;
      const newItem = { product, quantity };
      const updatedCart = cart.map((item) => {
        if (item.product.id === newItem.product.id) {
          existedItem = true;
          return newItem;
        }
        return item;
      });
      if (!existedItem) updatedCart.push(newItem);
      setCart(updatedCart);
    } else {
      setCart(cart.filter((item) => item.product.id !== product.id));
    }
  };

  const updateWishlist = (item) => {
    const index = wishlist.findIndex(
      (wishItem) => wishItem.product.id === item.product.id,
    );
    if (index > -1) {
      setWishlist([...wishlist.slice(0, index), ...wishlist.slice(index + 1)]);
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  return (
    <>
      <ScrollRestoration />
      <div className="min-h-screen flex flex-col justify-center items-center">
        <header>
          <Navbar
            authData={authData}
            wishlistLength={wishlist.length}
            cartLength={cart.reduce((sum, { quantity: q }) => sum + q, 0)}
          />
          <ToastContainer />
        </header>
        <main className="w-full h-full">
          {loading ? (
            <Loader />
          ) : (
            <Outlet
              context={{
                cart,
                wishlist,
                authData,
                deleteUser,
                updateCart,
                authenticate,
                authenticated,
                updateWishlist,
              }}
            />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
