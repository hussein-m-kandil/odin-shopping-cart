import { useEffect, useState } from 'react';
import {
  useLocation,
  useFetcher,
  Navigate,
  useOutletContext,
} from 'react-router-dom';
import {
  ENTRIES_NAMES,
  signinEntriesData,
  signupEntriesData,
  validateFormData,
} from './auth-form-utils';
import ComboInput from '../ComboInput/ComboInput';
import Button from '../Button/Button';
import { BiLoaderAlt } from 'react-icons/bi';
import { SIGNIN_PATH, SIGNUP_PATH } from '../../App';

const KNOWN_PATHS = [SIGNUP_PATH, SIGNIN_PATH];

function AuthForm() {
  const location = useLocation();
  const unknownPath = !KNOWN_PATHS.includes(location.pathname);
  const signInPath = location.pathname === SIGNIN_PATH;

  const [errorMessage, setErrorMessage] = useState(null);
  const [entriesData, setEntriesData] = useState(
    signInPath ? signinEntriesData : signupEntriesData,
  );

  const { authenticated, authenticate } = useOutletContext();

  const fetcher = useFetcher();
  const submitting = fetcher.state !== 'idle';
  const { authData, submitError, formErrors } = fetcher.data || {};

  useEffect(() => {
    if (submitError) setErrorMessage(submitError);
    if (authData) authenticate(authData);
  }, [submitError, submitting, authenticate, authData]);

  if (authenticated || unknownPath) {
    return <Navigate to="/" replace={true} />;
  }

  const changeFieldState = (name, e) => {
    setErrorMessage(null);
    const entryData = entriesData[name];
    const value = e.target.value;
    const updatedEntriesData = {
      ...entriesData,
      [name]: {
        ...entryData,
        attrs: { ...entryData.attrs, value },
      },
    };
    const { password, passwordConfirmation } = ENTRIES_NAMES;
    const formData = new FormData();
    formData.append(name, value);
    if (name === passwordConfirmation) {
      formData.append(password, updatedEntriesData[password].attrs.value);
    }
    const errors = validateFormData(formData);
    updatedEntriesData[name].error = (errors && errors[name]) || '';
    updatedEntriesData[name].attrs['aria-invalid'] = Boolean(
      errors && errors[name],
    );
    setEntriesData(updatedEntriesData);
  };

  const invalid = Object.values(entriesData).some(
    ({ error, attrs: { value } }) => error || !value,
  );

  const title = `Sign ${signInPath ? 'In' : 'Up'}`;

  return (
    <fetcher.Form
      noValidate
      method="post"
      aria-live="assertive"
      aria-labelledby="form-label"
      className="mx-auto min-h-screen max-w-xl flex flex-col justify-center p-4 pt-16"
    >
      <h1 id="form-label" className="font-bold mb-4">
        {title}
      </h1>
      {errorMessage && (
        <div
          role="alert"
          className="bg-red-400/25 p-4 mb-4 text-center text-red-700 rounded-lg"
        >
          {errorMessage}
        </div>
      )}
      <div className="space-y-4">
        {Object.entries(entriesData).map(([name, { attrs, error }], i) => {
          const actionError = formErrors ? formErrors[name] : '';
          const props = {
            onChange: (e) => changeFieldState(name, e),
            className: submitting ? 'text-gray-500' : '',
            error: error || actionError,
            disabled: submitting,
            id: name,
            name,
          };
          if (i === 0) props.autoFocus = true;
          return <ComboInput key={name} {...props} {...attrs} />;
        })}
      </div>
      <Button
        type="submit"
        className="ms-auto mt-4 px-3"
        name="intent"
        value={signInPath ? SIGNIN_PATH : SIGNUP_PATH}
        disabled={submitting || invalid}
      >
        {submitting && (
          <BiLoaderAlt
            className="inline-block me-2 motion-safe:animate-spin"
            title="Submitting..."
          />
        )}
        {title}
      </Button>
    </fetcher.Form>
  );
}

export default AuthForm;
