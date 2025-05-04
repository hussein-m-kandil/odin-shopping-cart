import { useEffect, useState } from 'react';
import {
  useLocation,
  useFetcher,
  Navigate,
  useOutletContext,
  Link,
} from 'react-router-dom';
import {
  ENTRIES_NAMES,
  signinEntriesData,
  signupEntriesData,
  validateFormData,
} from './auth-form-utils';
import { BiLoaderAlt } from 'react-icons/bi';
import { SIGNIN_PATH, SIGNUP_PATH } from '../../App';
import Button from '../Button/Button';
import ComboInput from '../ComboInput/ComboInput';
import PageHeadline from '../PageHeadline/PageHeadline';

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
    if (submitError && !submitting) setErrorMessage(submitError);
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
    const { password, confirm: passwordConfirmation } = ENTRIES_NAMES;
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
      className="mx-auto w-full max-w-xl flex flex-col justify-center px-4 py-8"
    >
      <PageHeadline id="form-label">
        {title}
        <br />
        <span className="text-blue-700 text-center text-sm font-light underline active:text-black visited:text-purple-700">
          {signInPath ? (
            <Link to={SIGNUP_PATH}>
              or sign up if you do not have an account
            </Link>
          ) : (
            <Link to={SIGNIN_PATH}>
              or sign in if you already have an account
            </Link>
          )}
        </span>
      </PageHeadline>
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
