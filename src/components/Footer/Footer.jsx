import mastercard from '../../assets/logos/master-card-logo.png';
import amazonPay from '../../assets/logos/amazon-pay-logo.png';
import googlePlay from '../../assets/logos/google-play.png';
import appStore from '../../assets/logos/app-store.png';
import paypal from '../../assets/logos/paypal-logo.png';
import Button from '../Button/Button';

function Footer() {
  const emailInputId = 'get-app-form-email';

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.elements[emailInputId].value = '';
    Array.from(e.target.elements).forEach((entry) => (entry.disabled = true));
  };

  return (
    <footer className="bg-app-main/4 p-8">
      <div className="container mx-auto">
        <form aria-labelledby="get-app-form-label" onSubmit={handleSubmit}>
          <h2 id="get-app-form-label" className="font-light">
            Get the {import.meta.env.VITE_APP_NAME} app
          </h2>
          <p className="font-light text-xs text-gray-500">
            We will send you an email with the URL for our app to download it on
            your phone.
          </p>
          <div className="flex flex-wrap gap-4 my-6 px-4 text-xs">
            <input
              required
              type="email"
              id={emailInputId}
              placeholder="Enter your email"
              className="bg-white p-2 border-gray-300 border-1 rounded-lg grow focus:outline-gray-400 disabled:opacity-50"
            />
            <Button className="px-4 py-2 ms-auto">Get App</Button>
          </div>
        </form>
        <div className="border-y-1 border-gray-300 py-4 px-2 mx-2 flex flex-wrap justify-between items-center text-xs font-light">
          <div className="flex flex-wrap gap-1 items-center w-fit mx-auto">
            <h3>Payment Partners</h3>
            <img src={amazonPay} alt="Amazon Pay" width="40px" />
            <img src={mastercard} alt="Mastercard" width="30px" />
            <img src={paypal} alt="Paypal" width="40px" />
          </div>
          <div className="flex flex-wrap gap-1 items-center w-fit mx-auto">
            <h3>Get Deliveries with {import.meta.env.VITE_APP_NAME}</h3>
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
