import { useEffect, useRef, useState } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import { BsCart4 as ShoppingCart } from 'react-icons/bs';
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
  BRANDS_PATH,
  SIGNUP_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  PRODUCTS_PATH,
  CATEGORIES_PATH,
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

function Navbar({ authenticated = false }) {
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
    const collapseNavMenuOnClickOutside = (e) => {
      if (!nav.contains(e.target)) setExpanded(false);
    };
    html.addEventListener('click', collapseNavMenuOnClickOutside);
    return () => {
      html.removeEventListener('click', collapseNavMenuOnClickOutside);
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

  const BrandTag = useMatch('/') ? 'h1' : 'div';

  const wideScreen = screenWidth >= 640;
  const navMenuId = 'controlled-nav-menu';

  return (
    <nav ref={navRef} className="fixed z-30 inset-x-0 top-0 bg-app-light p-4">
      <div className="container mx-auto items-center gap-4 sm:flex">
        <div
          className={`flex flex-wrap justify-between max-sm:px-2 ${expanded ? 'border-gray-200 max-sm:border-b max-sm:pb-4' : ''}`}
        >
          <div className="flex items-center">
            <ShoppingCart
              className="h-5 text-xl text-app-main"
              alt="An illustration for a shopping cart"
            />
            <BrandTag className="text-sm font-bold">
              {import.meta.env.VITE_APP_NAME || 'App Name'}
            </BrandTag>
          </div>
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
            {authenticated &&
              [
                ['Home', HOME_PATH],
                ['Cart', CART_PATH],
                ['Products', PRODUCTS_PATH],
                ['Categories', CATEGORIES_PATH],
                ['Brands', BRANDS_PATH],
              ].map(([pageName, pagePath]) => (
                <li key={pagePath}>
                  <NavLink to={pagePath} className={genNavLinkClasses}>
                    {pageName}
                  </NavLink>
                </li>
              ))}
            <li className="ms-auto">
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

Navbar.propTypes = { authenticated: PropTypes.bool };

export default Navbar;
