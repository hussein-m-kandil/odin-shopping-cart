import PropTypes from 'prop-types';

function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-app-main outline-gray-500 p-2 text-white active:not-disabled:scale-95 disabled:opacity-50 ${className || ''}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = { children: PropTypes.any, className: PropTypes.string };

export default Button;
