import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { SIGNOUT_PATH } from '../../App';
import Profile from './Profile';
import userEvent from '@testing-library/user-event';

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
              <Outlet
                context={{ authData: AUTH_DATA, deleteUser: deleteUserMock }}
              />
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
    expect(
      screen.getByText(new RegExp(AUTH_DATA.user.fullname)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(AUTH_DATA.user.username)),
    ).toBeInTheDocument();
  });

  it('has user name in the page title', () => {
    render(<RoutedProfile />);
    expect(document.title).toMatch(new RegExp(AUTH_DATA.user.fullname));
  });

  it('has sign out link', () => {
    render(<RoutedProfile />);
    const signoutLink = screen.getByRole('link', { name: /sign out/i });
    expect(signoutLink).toBeInTheDocument();
    expect(signoutLink.href).toMatch(new RegExp(`${SIGNOUT_PATH}$`));
  });

  it('has a form with an username field for deleting user account', () => {
    render(<RoutedProfile />);
    expect(screen.getByRole('form', { name: /delete/i })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /username/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});

describe('Delete user form', () => {
  it('does disabled while the username field is empty', () => {
    render(<RoutedProfile />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('has validation error on invalid username & remains disabled', async () => {
    const user = userEvent.setup();
    render(<RoutedProfile />);
    await user.type(
      screen.getByRole('textbox', { name: /username/i }),
      'foobar',
    );
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInvalid();
    expect(screen.getByText(/username does not match/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('removes validation error on empty username but remains disabled', async () => {
    const user = userEvent.setup();
    render(<RoutedProfile />);
    await user.type(screen.getByRole('textbox', { name: /username/i }), 'x');
    await user.clear(screen.getByRole('textbox', { name: /username/i }));
    await user.keyboard('{Enter}');
    expect(screen.queryByText(/username does not match/i)).toBeNull();
    expect(screen.getByRole('textbox', { name: /username/i })).toBeValid();
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('deletes user by its id & redirects to public route on submit', async () => {
    const user = userEvent.setup();
    render(<RoutedProfile />);
    await user.type(
      screen.getByRole('textbox', { name: /username/i }),
      AUTH_DATA.user.username,
    );
    await user.keyboard('{Enter}');
    expect(deleteUserMock).toBeCalledTimes(1);
  });
});
