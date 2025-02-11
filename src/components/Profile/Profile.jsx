import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import ComboInput from '../ComboInput/ComboInput';
import Button from '../Button/Button';
import { SIGNOUT_PATH } from '../../App';
import PageTitle from '../../PageTitle';

function Profile() {
  const { authData, deleteUser } = useOutletContext();
  const [emailValue, setEmailValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const invalidEmailValue = Boolean(errorMessage);

  const handleChangeEmail = (e) => {
    const newEmailValue = e.target.value;
    setEmailValue(newEmailValue);
    setErrorMessage(
      newEmailValue && newEmailValue !== authData.email
        ? 'This email does not match your email!'
        : '',
    );
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (!errorMessage) deleteUser();
  };

  return (
    <>
      <PageTitle pageTitle={authData.name} />
      <section className="text-center mt-4 mb-8">
        <h2 className="font-bold text-xl">{authData.name}</h2>
        <p className="text-sm text-gray-700 font-light">{authData.email}</p>
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
          id={`email-${authData.objectId}`}
          label="Type your email"
          type="email"
          value={emailValue}
          className="text-xs"
          error={errorMessage}
          aria-invalid={invalidEmailValue}
          onChange={handleChangeEmail}
        />
        <div className="w-fit ms-auto">
          <Button
            type="submit"
            className="bg-orange-400"
            disabled={!emailValue || Boolean(errorMessage)}
          >
            Delete my account permanently
          </Button>
        </div>
      </form>
    </>
  );
}

export default Profile;
