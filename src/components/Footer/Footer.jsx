import { FaTiktok as Tiktok } from 'react-icons/fa6';
import { FaYoutube as Youtube } from 'react-icons/fa6';
import { FaTwitter as Twitter } from 'react-icons/fa6';
import { FaFacebook as Facebook } from 'react-icons/fa6';
import { FaLinkedin as LinkedIn } from 'react-icons/fa6';
import { FaInstagram as Instagram } from 'react-icons/fa6';
import mastercard from '../../assets/logos/master-card-logo.png';
import amazonPay from '../../assets/logos/amazon-pay-logo.png';
import googlePlay from '../../assets/logos/google-play.png';
import appStore from '../../assets/logos/app-store.png';
import paypal from '../../assets/logos/paypal-logo.png';
import Button from '../Button/Button';
import PropTypes from 'prop-types';

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

function Footer() {
  const emailInputId = 'get-app-form-email';

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.elements[emailInputId].value = '';
    Array.from(e.target.elements).forEach((entry) => (entry.disabled = true));
  };

  return (
    <footer className="bg-app-light p-8">
      <div className="container mx-auto">
        <form aria-labelledby="get-app-form-label" onSubmit={handleSubmit}>
          <div className="text-center font-light">
            <h2 id="get-app-form-label">
              Get the {import.meta.env.VITE_APP_NAME} app
            </h2>
            <p className="text-xs text-gray-500">
              We will send you an email with the URL for our app to download it
              on your phone.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 my-4 text-xs *:grow max-w-4xl mx-auto">
            <input
              required
              type="email"
              id={emailInputId}
              placeholder="Enter your email"
              className="min-w-12 bg-white p-2 border-gray-300 border-1 rounded-lg focus:outline-gray-400 disabled:opacity-50"
            />
            <Button className="px-4 py-2 sm:max-w-32">Get App</Button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 text-xs mx-auto w-fit my-4">
          {socialData.map((data) => (
            <Social key={data.url} {...data} />
          ))}
        </div>
        <div className="border-y-1 border-gray-300 py-4 px-2 mx-2 flex flex-wrap justify-between items-center text-xs font-light">
          <div className="flex flex-wrap gap-1 items-center w-fit mx-auto">
            <h3>Payment Partners</h3>
            <img src={amazonPay} alt="Amazon Pay" width="40px" />
            <img src={mastercard} alt="Mastercard" width="30px" />
            <img src={paypal} alt="Paypal" width="40px" />
          </div>
          <div className="flex flex-wrap gap-1 items-center w-fit mx-auto">
            <h3>Get Deliveries with</h3>
            <img
              src={appStore}
              alt="Get on App Store"
              width="50px"
              className="rounded-sm"
            />
            <img
              src={googlePlay}
              alt="Get on Google Play"
              width="50px"
              className="rounded-sm"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
