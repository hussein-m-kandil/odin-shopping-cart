import { toast, ToastContainer } from 'react-toastify';
import {
  Outlet,
  useMatch,
  useNavigate,
  ScrollRestoration,
} from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import * as authServices from './services/auth';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './Loader';

export const HOME_PATH = '/';
export const CART_PATH = '/cart';
export const SIGNUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const PROFILE_PATH = '/profile';
export const SIGNOUT_PATH = '/signout';
export const WISHLIST_PATH = '/wishlist';
export const CATEGORY_PATH = '/category';
export const CATEGORIES_PATH = '/categories';
export const APP_NAME = 'Odin Shopping Cart';
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

const ERROR_TOAST_CONFIG = { type: 'error', autoClose: 3000 };

const SUCCESS_TOAST_CONFIG = { type: 'success', autoClose: 3000 };

function App() {
  // authData: { token: string, user: { id: string, username: string, fullname: string, ... } }
  const [authData, setAuthData] = useState(parsedAuthData);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  const clearUserState = useCallback(() => {
    navigate(HOME_PATH);
    setAuthData(null);
    setWishlist([]);
    setCart([]);
  }, [navigate]);

  useEffect(() => {
    if (parsedAuthData) {
      authServices
        .getSigninValidation(parsedAuthData.token)
        .then(({ data, error }) => {
          if (data !== true) {
            throw error?.message ? error : new Error('Authentication failed!');
          }
        })
        .catch((error) => {
          setAuthData(null);
          toast(error.message, ERROR_TOAST_CONFIG);
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
        clearUserState();
      }
    }
  }, [signoutPathMatch, authData, clearUserState]);

  const authenticate = (newAuthData) => {
    setAuthData(newAuthData);
    try {
      localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(newAuthData));
    } catch {
      toast('Storing authentication data failed!', ERROR_TOAST_CONFIG);
    }
  };

  const deleteUser = () => {
    return authServices
      .deleteUser(authData.user.id, authData.token)
      .then(({ error }) => {
        if (error) throw Error('Account Deletion Failed!');
        try {
          localStorage.removeItem(AUTH_DATA_KEY);
        } catch (error) {
          console.log(error);
        } finally {
          clearUserState();
        }
      })
      .catch((error) => toast(error.message, ERROR_TOAST_CONFIG));
  };

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

  const checkout = () => {
    if (authData) {
      setCart([]);
      navigate(HOME_PATH);
      toast('Have a nice day!', SUCCESS_TOAST_CONFIG);
    } else navigate(SIGNIN_PATH);
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
        <main className="container mx-auto mb-4">
          {loading ? (
            <Loader />
          ) : (
            <Outlet
              context={{
                cart,
                checkout,
                wishlist,
                authData,
                deleteUser,
                updateCart,
                authenticate,
                updateWishlist,
                authenticated: Boolean(authData),
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
