import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Outlet, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { postSignin, postSignup } from '../../services/auth';
import {
  ENTRIES_NAMES,
  fieldsValidations,
  authFormAction,
} from './auth-form-utils';
import userEvent from '@testing-library/user-event';
import PropTypes from 'prop-types';
import AuthForm from './AuthForm';

// To fix a bug in node URLSearchParams
// https://github.com/remix-run/react-router/issues/13495#issuecomment-2839707928
import { URLSearchParams } from 'node:url';
globalThis.URLSearchParams = URLSearchParams;

const AUTH_DATA = {
  token:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpZCI6ImY5NjNlYzBjLTI5NTMtNDVjYi1iNTI5LWJmMWZlNjlmOTFmMiIsInVzZXJuYW1lIjoic3VwZXJtYW4iL' +
    'CJmdWxsbmFtZSI6IkNsYXJrIEtlbnQgLyBLYWwtRWwiLCJpYXQiOjE3NDYzNDM3ODMsImV4cCI6MTc0NjYwMjk4M30' +
    '.0iI69Z7wLDkczEYlEmSkrzdKatJ3HIFlUwFb_jAZo2k',
  user: {
    id: 'f963ec0c-2953-45cb-b529-bf1fe69f91f2',
    username: 'superman',
    fullname: 'Clark Kent / Kal-El',
    createdAt: '2025-05-02T16:36:06.697Z',
    updatedAt: '2025-05-02T16:36:06.697Z',
  },
};

vi.mock('../../services/auth', () => {
  const fakeAuthService = () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ data: AUTH_DATA }), 0),
    );
  };

  return {
    postSignin: vi.fn(fakeAuthService),
    postSignup: vi.fn(fakeAuthService),
  };
});

const authenticateMock = vi.fn();

beforeEach(() => vi.resetAllMocks());

const errorMessageMock = 'Sing-in error!';

const throwErrorMock = () => {
  throw Error(errorMessageMock);
};

const homeContent = 'Home';
const signupPath = '/signup';
const signinPath = '/signin';

function RoutedForm({
  routerOptions = {
    initialEntries: [signupPath],
    initialIndex: 0,
  },
}) {
  return (
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: '/',
            element: <Outlet context={{ authenticate: authenticateMock }} />,
            children: [
              { index: true, element: <div>{homeContent}</div> },
              {
                path: signupPath,
                element: <AuthForm />,
                action: authFormAction,
              },
              {
                path: signinPath,
                element: <AuthForm />,
                action: authFormAction,
              },
            ],
          },
        ],
        {
          ...routerOptions,
        },
      )}
    />
  );
}

RoutedForm.propTypes = {
  routerOptions: PropTypes.shape({
    initialEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number.isRequired,
  }),
};

async function fillValidSignupForm(user, form) {
  const correctSignupFormEntries = Object.entries(fieldsValidations).map(
    ([name, { example }]) => {
      return [name, example];
    },
  );
  correctSignupFormEntries.push([
    ENTRIES_NAMES.confirm,
    fieldsValidations[ENTRIES_NAMES.password].example,
  ]);
  for (const [name, value] of correctSignupFormEntries) {
    await user.type(form.elements[name], value);
  }
}

async function fillValidSigninForm(user, form) {
  const correctSigninFormEntries = [
    [ENTRIES_NAMES.username, fieldsValidations[ENTRIES_NAMES.username].example],
    [ENTRIES_NAMES.password, fieldsValidations[ENTRIES_NAMES.password].example],
  ];
  for (const [name, value] of correctSigninFormEntries) {
    await user.type(form.elements[name], value);
  }
}

describe('Form contents', () => {
  it('has the appropriate heading/fields for "/signup" route', () => {
    render(<RoutedForm />);
    expect(
      screen.getByRole('heading', { name: /Sign Up/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(2);
  });

  it('has the appropriate heading/fields for "/signin" route', () => {
    render(
      <RoutedForm
        routerOptions={{
          initialEntries: ['/signin'],
          initialIndex: 0,
        }}
      />,
    );
    expect(
      screen.getByRole('heading', { name: /Sign In/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(2);
  });

  it('has a submit button', () => {
    render(<RoutedForm />);
    expect(screen.getByRole('button', { name: /sign/i }).type).toBe('submit');
  });
});

describe('Form controls', () => {
  it('reflects the changes in displayed values while typing', async () => {
    const user = userEvent.setup();
    render(<RoutedForm />);
    const inputs = screen.getAllByRole('textbox');
    for (let i = 0; i < inputs.length; i++) {
      const text = `Test text #${i + 1}`;
      const input = inputs[i];
      expect(input.value).toBe('');
      await user.type(input, text);
      expect(screen.getByDisplayValue(text)).toBeInTheDocument();
    }
  });

  it('performs a realtime validation', async () => {
    const user = userEvent.setup();
    render(<RoutedForm />);
    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const usernameErrorMessage = fieldsValidations[ENTRIES_NAMES.username].msg;
    await user.type(usernameInput, 'x');
    expect(screen.getByText(usernameErrorMessage)).toBeInTheDocument();
    expect(usernameInput.getAttribute('aria-invalid')).toBe('true');
    expect(usernameInput.getAttribute('aria-errormessage')).toBeTruthy();
    await user.type(usernameInput, '@tar.baz');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByText(usernameErrorMessage)).toBeNull();
    expect(usernameInput.getAttribute('aria-invalid')).toBeOneOf([
      'false',
      null,
    ]);
    expect(usernameInput.getAttribute('aria-errormessage')).toBeFalsy();
    await user.clear(usernameInput);
    await user.click(document.body);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(usernameInput.getAttribute('aria-invalid')).toBe('true');
    expect(usernameInput.getAttribute('aria-errormessage')).toBeTruthy();
  });
});

describe('Form submit', () => {
  it('disables the form and shows loading indicator on submit', async () => {
    const user = userEvent.setup();
    render(<RoutedForm />);
    await fillValidSignupForm(user, screen.getByRole('form'));
    const submitter = screen.getByRole('button', { name: /sign/i });
    expect(submitter.disabled).toBe(false);
    fireEvent.click(submitter);
    expect(screen.getByTitle(/submitting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign/i }).disabled).toBe(true);
    expect(screen.getAllByRole('textbox').every((inp) => inp.disabled)).toBe(
      true,
    );
  });

  it('does not submit if all fields are empty', async () => {
    const user = userEvent.setup();
    render(<RoutedForm />);
    const form = screen.getByRole('form');
    const submitter = screen.getByRole('button', { name: /sign/i });
    expect(form).toBeInTheDocument();
    expect(submitter).toBeInTheDocument();
    expect(submitter.disabled).toBe(true);
    await user.keyboard('{Enter}');
    await user.click(submitter);
    expect(form).toBeInTheDocument();
    expect(submitter).toBeInTheDocument();
    expect(submitter.disabled).toBe(true);
  });

  it('does not submit if there is an invalid field', async () => {
    const user = userEvent.setup();
    render(<RoutedForm />);
    const usernameErrorMessage = fieldsValidations[ENTRIES_NAMES.username].msg;
    await user.type(screen.getByRole('textbox', { name: /username/i }), 'x');
    const usernameErrorElement = screen.getByText(usernameErrorMessage);
    const submitter = screen.getByRole('button', { name: /sign/i });
    expect(usernameErrorElement).toBeInTheDocument();
    expect(submitter).toBeInTheDocument();
    expect(submitter.disabled).toBe(true);
    await user.click(submitter);
    await user.keyboard('{Enter}');
    expect(submitter).toBeInTheDocument();
    expect(submitter.disabled).toBe(true);
    expect(usernameErrorElement).toBeInTheDocument();
  });

  it('displays sign-up request error, then removes it on first change', async () => {
    postSignup.mockImplementationOnce(throwErrorMock);
    const user = userEvent.setup();
    render(
      <RoutedForm
        routerOptions={{ initialEntries: [signupPath], initialIndex: 0 }}
      />,
    );
    await fillValidSignupForm(user, screen.getByRole('form'));
    await user.click(screen.getByRole('button', { name: /sign/i }));
    expect(screen.getByText(errorMessageMock)).toBeInTheDocument();
    expect(postSignup).toHaveBeenCalledTimes(1);
    expect(authenticateMock).not.toHaveBeenCalled();
    await user.type(screen.getByRole('textbox', { name: 'Password' }), '1');
    expect(screen.queryByText(errorMessageMock)).toBeNull();
  });

  it('displays sign-in request error, then removes it on first change', async () => {
    postSignin.mockImplementationOnce(throwErrorMock);
    const user = userEvent.setup();
    render(
      <RoutedForm
        routerOptions={{ initialEntries: [signinPath], initialIndex: 0 }}
      />,
    );
    await fillValidSigninForm(user, screen.getByRole('form'));
    await user.click(screen.getByRole('button', { name: /sign/i }));
    expect(screen.getByText(errorMessageMock)).toBeInTheDocument();
    expect(postSignin).toHaveBeenCalledTimes(1);
    expect(authenticateMock).not.toHaveBeenCalled();
    await user.type(screen.getByRole('textbox', { name: 'Password' }), '1');
    expect(screen.queryByText(errorMessageMock)).toBeNull();
  });
});
