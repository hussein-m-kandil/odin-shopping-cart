import PropTypes from 'prop-types';
import { BiLoaderAlt } from 'react-icons/bi';

function Loader({ className, ...props }) {
  return (
    <div
      aria-label="Loading..."
      className={`w-fit animate-spin text-4xl text-app-main mx-auto${className ? ' ' + className : ''}`}
      {...props}
    >
      <BiLoaderAlt />
    </div>
  );
}

Loader.propTypes = { className: PropTypes.string };

export default Loader;
