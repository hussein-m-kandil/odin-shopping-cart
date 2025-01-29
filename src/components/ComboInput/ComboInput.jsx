import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Returns a HTML `div` contains `label`, `input`, and the given children.
 * The give children are placed after the `input`, so it fits well an error message.
 *
 * @param {React.PropsWithChildren} props
 * @returns {React.JSX.Element}
 */
function ComboInput({ id, label, error, className, ...inputProps }) {
  if (!label || !id) {
    throw TypeError('Missing props: "label" & "id"!');
  }

  const [passVisible, setPassVisible] = useState(false);

  const togglePassVisible = (e) => {
    setPassVisible(!passVisible);
    e.currentTarget.previousElementSibling?.focus();
  };

  const passwordInput = inputProps.type === 'password';

  const errorMessageId = error ? `${id}-error` : undefined;

  return (
    <div className="relative">
      <label htmlFor={id} className="font-light inline-block mb-0.5">
        {label}
      </label>
      <div className="relative bg-white">
        <input
          id={id}
          {...inputProps}
          type={
            passwordInput && passVisible ? 'text' : inputProps.type || 'text'
          }
          className={`w-full p-2 text-lg rounded-lg border-1 border-gray-300 \
        aria-invalid:border-red-700 outline-gray-400 aria-invalid:outline-red-700 \
        not-[[value='']]:not-aria-invalid:outline-green-700${passwordInput ? ' pe-7' : ''}${' ' + className || ''}`}
          aria-errormessage={errorMessageId}
        />
        {passwordInput && (
          <button
            type="button"
            aria-label="Show password"
            onClick={togglePassVisible}
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-75 h-full p-2 rounded-r-lg outline-gray-500"
          >
            {passVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
          </button>
        )}
      </div>
      {errorMessageId && (
        <div
          id={errorMessageId}
          role="alert"
          className="text-xs mt-1 text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}

ComboInput.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.element,
};

export default ComboInput;
