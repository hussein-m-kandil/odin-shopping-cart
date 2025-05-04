import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import ComboInput from '../ComboInput/ComboInput';
import Button from '../Button/Button';
import { SIGNOUT_PATH } from '../../App';
import PageTitle from '../../PageTitle';
import { BiLoaderAlt } from 'react-icons/bi';

function Profile() {
  const { authData, deleteUser } = useOutletContext();
  const [usernameValue, setUsernameValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deleting, setDeleting] = useState(false);

  const invalidUsernameValue = Boolean(errorMessage);

  const handleChangeUsername = (e) => {
    const newUsernameValue = e.target.value;
    setUsernameValue(newUsernameValue);
    setErrorMessage(
      newUsernameValue && newUsernameValue !== authData.user.username
        ? 'The given username does not match yours!'
        : '',
    );
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (!errorMessage) {
      setDeleting(true);
      deleteUser().catch(() => setDeleting(false));
    }
  };

  return (
    <>
      <PageTitle pageTitle={authData.user.fullname} />
      <section className="text-center mt-4 mb-8">
        <h2 className="font-bold text-xl">{authData.user.fullname}</h2>
        <p className="text-sm text-gray-700 font-light">
          {authData.user.username}
        </p>
        <Link
          to={SIGNOUT_PATH}
          replace={true}
          className="text-blue-700 text-center text-xs font-light underline active:text-black visited:text-purple-700"
        >
          Sign out
        </Link>
      </section>
      <form
        onSubmit={handleDeleteAccount}
        aria-label="Delete your account"
        noValidate={true}
        className="p-4 max-w-lg mx-auto space-y-2 text-sm"
      >
        <ComboInput
          id={`username-${authData.user.id}`}
          label="Type your username"
          type="text"
          value={usernameValue}
          className="text-xs"
          error={errorMessage}
          aria-invalid={invalidUsernameValue}
          onChange={handleChangeUsername}
        />
        <div className="w-fit ms-auto">
          <Button
            type="submit"
            className="bg-orange-400"
            disabled={!usernameValue || Boolean(errorMessage)}
          >
            {deleting && (
              <BiLoaderAlt
                className="inline-block me-2 motion-safe:animate-spin"
                title="Deleting..."
              />
            )}
            Delete my account permanently
          </Button>
        </div>
      </form>
    </>
  );
}

export default Profile;
