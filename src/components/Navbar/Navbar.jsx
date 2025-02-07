import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useMatch } from 'react-router-dom';
import { BsHeartFill, BsCart4 as ShoppingCart } from 'react-icons/bs';
import { FaInstagram as Instagram } from 'react-icons/fa6';
import { FaLinkedin as LinkedIn } from 'react-icons/fa6';
import { FaFacebook as Facebook } from 'react-icons/fa6';
import { FaYoutube as Youtube } from 'react-icons/fa6';
import { FaTwitter as Twitter } from 'react-icons/fa6';
import { FaTiktok as Tiktok } from 'react-icons/fa6';
import { FaBars as Bars } from 'react-icons/fa';
import PropTypes from 'prop-types';
import {
  HOME_PATH,
  CART_PATH,
  SIGNUP_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  WISHLIST_PATH,
} from '../../App';

const socialData = [
  { name: 'Instagram', icon: <Instagram />, url: 'https://www.instagram.com/' },
  { name: 'Facebook', icon: <Facebook />, url: 'https://www.facebook.com/' },
  { name: 'Tiktok', icon: <Tiktok />, url: 'https://www.tiktok.com/' },
  { name: 'Twitter', icon: <Twitter />, url: 'https://www.twitter.com/' },
  { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://www.linkedin.com/' },
  { name: 'Youtube', icon: <Youtube />, url: 'https://www.youtube.com/' },
];

function Social({ url, name, icon }) {
  return (
    <a
      href={url}
      aria-label={`Visit ${name} in new window`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

Social.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

function Navbar({
  authenticated = false,
  cartItemsCount = 0,
  wishlistItemsCount = 0,
}) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [expanded, setExpanded] = useState(false);
  const signupPathMatch = useMatch(SIGNUP_PATH);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScreenResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleScreenResize);
    return () => window.removeEventListener('resize', handleScreenResize);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const html = document.documentElement;
    const oldHtmlPaddingTop = html.style.paddingTop;
    const collapseNavMenuOnClickOutside = (e) => {
      if (!nav.contains(e.target)) setExpanded(false);
    };
    html.addEventListener('click', collapseNavMenuOnClickOutside);
    html.style.paddingTop = getComputedStyle(nav).height;
    return () => {
      html.removeEventListener('click', collapseNavMenuOnClickOutside);
      html.style.paddingTop = oldHtmlPaddingTop;
    };
  }, []);

  const collapseNavMenuOnClickLink = (e) => {
    if (e.target.localName === 'a') setExpanded(false);
  };

  const genNavLinkClasses = ({ isActive }) => {
    const base = 'active:underline inline-block w-full';
    const sm = 'max-sm-active:bg-gray-700 max-sm:bg-gray-200 max-sm:p-2';
    return `${base} ${sm} ${isActive ? 'text-black font-normal' : 'text-gray-700 font-light'}`;
  };

  const wideScreen = screenWidth >= 640;
  const navMenuId = 'controlled-nav-menu';

  return (
    <nav ref={navRef} className="fixed z-30 inset-x-0 top-0 bg-app-light p-4">
      <div className="container mx-auto items-center sm:flex">
        <div
          className={`flex flex-wrap justify-between max-sm:px-2 ${expanded ? 'border-gray-200 max-sm:border-b max-sm:pb-4' : ''}`}
        >
          <h1 className="font-bold">
            <Link to={HOME_PATH}>
              {import.meta.env.VITE_APP_NAME || 'App Name'}
            </Link>
          </h1>
          {!wideScreen && (
            <button
              type="button"
              aria-controls={navMenuId}
              aria-expanded={expanded}
              aria-label="Toggle navigation menu"
              className={`ms-auto transition-transform ${expanded ? '-rotate-90' : ''}`}
              onClick={() => setExpanded(!expanded)}
            >
              <Bars />
            </button>
          )}
        </div>
        {(wideScreen || expanded) && (
          <ul
            id={navMenuId}
            className={`grow items-center gap-2 text-center text-xs max-sm:space-y-2 max-sm:px-2 sm:flex ${authenticated ? 'max-sm:pt-4' : ''}`}
            onClick={collapseNavMenuOnClickLink}
          >
            <li>
              <NavLink
                to={CART_PATH}
                aria-label="Cart"
                className={({ isActive }) =>
                  `relative${isActive ? '' : ' opacity-65'}`
                }
              >
                <span className="text-2xl text-app-main">
                  <ShoppingCart className="inline" />
                </span>
                <span className="bg-red-700 absolute -top-11/10 -right-1/2 py-0.5 min-w-6 rounded-lg text-white text-[0.60rem] font-semibold">
                  {cartItemsCount > 99 ? '+99' : cartItemsCount.toFixed(0)}
                  {/* +99 */}
                </span>
              </NavLink>
            </li>
            <li className="ms-auto">
              <NavLink
                to={WISHLIST_PATH}
                aria-label="Wishlist"
                className={({ isActive }) => `${isActive ? '' : ' opacity-65'}`}
              >
                <span className="text-2xl text-red-700 opacity-75 relative">
                  <BsHeartFill className="inline" />
                  <span className="absolute top-1/2 left-1/2 -translate-1/2 text-white text-[0.60rem] font-bold">
                    {wishlistItemsCount > 99
                      ? '+99'
                      : wishlistItemsCount.toFixed(0)}
                  </span>
                </span>
              </NavLink>
            </li>
            <li>
              <div className="flex flex-wrap gap-2 text-xs max-sm:mx-auto max-sm:my-4 max-sm:w-fit">
                {socialData.map((data) => (
                  <Social key={data.url} {...data} />
                ))}
              </div>
            </li>
            {authenticated ? (
              <li>
                <NavLink to={SIGNOUT_PATH} className={genNavLinkClasses}>
                  Sign out
                </NavLink>
              </li>
            ) : signupPathMatch ? (
              <li>
                <NavLink to={SIGNIN_PATH} className={genNavLinkClasses}>
                  Sign in
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to={SIGNUP_PATH} className={genNavLinkClasses}>
                  Sign up
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  authenticated: PropTypes.bool,
  cartItemsCount: PropTypes.number,
  wishlistItemsCount: PropTypes.number,
};

export default Navbar;
