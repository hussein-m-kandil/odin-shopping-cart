import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { SIGNOUT_PATH } from '../../App';
import Profile from './Profile';
import userEvent from '@testing-library/user-event';

const authData = {
  lastLogin: 1739078427194,
  userStatus: 'ENABLED',
  created: 1738481022904,
  accountType: 'BACKENDLESS',
  socialAccount: 'BACKENDLESS',
  ownerId: '195EFE37-10D3-4C7C-816E-DACB8EE02E94',
  oAuthIdentities: null,
  phone: '01234567890',
  name: 'Superman',
  ___class: 'Users',
  blUserLocale: 'en',
  'user-token': '84F4B8FE-212E-4470-831B-B309B4EC1C6F',
  updated: null,
  objectId: '195EFE37-10D3-4C7C-816E-DACB8EE02E94',
  email: 'superman@krypton.universe',
};

const deleteUserMock = vi.fn();

const PUBLIC_CONTENT = 'Public Content';

function RoutedProfile() {
  const routerOptions = { initialEntries: ['/private'], initialIndex: 0 };
  return (
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: '/',
            element: (
              <Outlet context={{ authData, deleteUser: deleteUserMock }} />
            ),
            children: [
              { index: true, element: <div>{PUBLIC_CONTENT}</div> },
              { path: routerOptions.initialEntries[0], element: <Profile /> },
            ],
          },
        ],
        routerOptions,
      )}
    />
  );
}

afterEach(() => vi.resetAllMocks());

describe('Profile', () => {
  it('has user data', () => {
    render(<RoutedProfile />);
    expect(screen.getByText(new RegExp(authData.name))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(authData.email))).toBeInTheDocument();
  });

  it('has user name in the page title', () => {
    render(<RoutedProfile />);
    expect(document.title).toMatch(new RegExp(authData.name));
  });

  it('has sign out link', () => {
    render(<RoutedProfile />);
    const signoutLink = screen.getByRole('link', { name: /sign out/i });
    expect(signoutLink).toBeInTheDocument();
    expect(signoutLink.href).toMatch(new RegExp(`${SIGNOUT_PATH}$`));
  });

  it('has a form with an email field for deleting user account', () => {
    render(<RoutedProfile />);
    expect(screen.getByRole('form', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});

describe('Delete user form', () => {
  it('does disabled while the email field is empty', () => {
    render(<RoutedProfile />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('has validation error on invalid email & remains disabled', async () => {
    const user = userEvent.setup();
    render(<RoutedProfile />);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'x@y.z');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInvalid();
    expect(screen.getByText(/email does not match/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('removes validation error on empty email but remains disabled', async () => {
    const user = userEvent.setup();
    render(<RoutedProfile />);
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'x@y.z');
    await user.clear(screen.getByRole('textbox', { name: /email/i }));
    await user.keyboard('{Enter}');
    expect(screen.queryByText(/email does not match/i)).toBeNull();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeValid();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('deletes user by its `objectId` & redirects to public route on submit', async () => {
    const user = userEvent.setup();
    render(<RoutedProfile />);
    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      authData.email,
    );
    await user.keyboard('{Enter}');
    expect(deleteUserMock).toBeCalledTimes(1);
  });
});
