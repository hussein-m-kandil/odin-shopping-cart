import { Link, NavLink } from 'react-router-dom';
import { BiCategory } from 'react-icons/bi';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  HOME_PATH,
  CART_PATH,
  SIGNIN_PATH,
  WISHLIST_PATH,
  PROFILE_PATH,
  CATEGORIES_PATH,
} from '../../App';
import {
  BsCircleFill,
  BsHeartFill,
  BsCart4 as ShoppingCart,
} from 'react-icons/bs';

function Navbar({ authData = null, cartLength = 0, wishlistLength = 0 }) {
  const navRef = useRef(null);
  const divRef = useRef(null);

  useEffect(() => {
    const preventNavbarOverlapping = () => {
      const nav = navRef.current;
      const div = divRef.current;
      if (nav && div) {
        div.style.paddingTop = getComputedStyle(nav).height;
      }
    };
    preventNavbarOverlapping();
    window.addEventListener('resize', preventNavbarOverlapping);
    return () => window.removeEventListener('resize', preventNavbarOverlapping);
  }, []);

  const generateNavLinkClassName = () => {
    const common = `text-2xl text-app-main relative flex flex-col justify-center active:scale-95`;
    return ({ isActive }) => `${isActive ? common : common + ' opacity-65'}`;
  };

  const limitCount = (count) => (count > 99 ? '+99' : count.toFixed(0));

  return (
    <>
      <nav ref={navRef} className="fixed z-30 inset-x-0 top-0 bg-app-light p-4">
        <div className="container mx-auto items-center flex flex-wrap">
          <h1 className="font-bold max-[350px]:mx-auto">
            <Link to={HOME_PATH}>
              {import.meta.env.VITE_APP_NAME || 'App Name'}
            </Link>
          </h1>
          <ul className="ms-auto max-[350px]:mx-auto items-center gap-2 text-center text-xs flex">
            {authData ? (
              <li>
                <NavLink
                  to={PROFILE_PATH}
                  aria-label="Profile"
                  className={generateNavLinkClassName()}
                >
                  <BsCircleFill />
                  <span className="text-white text-lg absolute top-1/2 left-1/2 -translate-1/2">
                    {authData.name[0].toUpperCase()}
                  </span>
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to={SIGNIN_PATH}
                  aria-label="Sign in"
                  className={generateNavLinkClassName()}
                >
                  <BsCircleFill />
                  <span className="text-white text-lg absolute top-1/2 left-1/2 -translate-1/2">
                    ?
                  </span>
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to={CATEGORIES_PATH}
                aria-label="Categories"
                className={generateNavLinkClassName()}
              >
                <BiCategory />
              </NavLink>
            </li>
            <li>
              <NavLink
                to={WISHLIST_PATH}
                aria-label="Wishlist"
                className={generateNavLinkClassName()}
              >
                <BsHeartFill />
                {wishlistLength > 0 && (
                  <span className="text-white text-[0.5rem] font-semibold absolute top-1/2 left-1/2 -translate-1/2">
                    {limitCount(wishlistLength)}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={CART_PATH}
                aria-label="Cart"
                className={generateNavLinkClassName()}
              >
                <ShoppingCart />
                {cartLength > 0 && (
                  <span className="text-white font-semibold text-[0.5rem] w-[1.1rem] py-[0.2rem] rounded-full bg-red-700 absolute -top-1/4 -right-1/4">
                    {limitCount(cartLength)}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="nav-div" ref={divRef}></div>
    </>
  );
}

Navbar.propTypes = {
  authData: PropTypes.object,
  wishlistLength: PropTypes.number,
  cartLength: PropTypes.number,
};

export default Navbar;
