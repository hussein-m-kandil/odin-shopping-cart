import '@testing-library/jest-dom/vitest';
import { vi, it, expect, describe, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryRouter,
  RouterProvider,
  useOutletContext,
} from 'react-router-dom';
import { getSigninValidation } from './services/auth';
import userEvent from '@testing-library/user-event';
import App from './App';

const CHILD_PAGE_TEXT = 'Child page mock!';
const AUTH_DATA = { objectId: 'Fake id', 'user-token': 'Fake token' };

function ChildPageMock() {
  const { authenticated, authenticate, signout } = useOutletContext();
  return (
    <>
      <h2>{CHILD_PAGE_TEXT}</h2>
      <p>{authenticated ? '' : 'Not '}Authenticated!</p>
      <button type="button" onClick={() => authenticate(AUTH_DATA)}>
        Authenticate
      </button>
      {authenticated && (
        <button type="button" onClick={signout}>
          Sign out
        </button>
      )}
    </>
  );
}

function RoutedApp() {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: '/',
          element: <App />,
          children: [{ path: '', element: <ChildPageMock /> }],
        },
      ])}
    />
  );
}

function generateGetSigninValidateMock(response) {
  const defaultResponse = { data: true, error: null };
  return vi.fn(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(response || defaultResponse), 0);
      }),
  );
}

vi.mock('./components/Navbar/Navbar', () => ({
  default: () => <div>Navbar</div>,
}));

vi.mock('./components/Footer/Footer', () => ({
  default: () => <div>Footer</div>,
}));

vi.mock('./services/auth', () => {
  return {
    postSignin: vi.fn(),
    postSignup: vi.fn(),
    getSignout: vi.fn(),
    deleteUser: vi.fn(),
    sendRequest: vi.fn(),
    getSigninValidation: generateGetSigninValidateMock(),
  };
});

const getItemFromStorageSpy = vi.spyOn(Storage.prototype, 'getItem');

afterEach(() => vi.resetAllMocks());

describe('App', () => {
  it('shows not-authenticated user content on locale storage error', async () => {
    getItemFromStorageSpy.mockImplementation(() => {
      throw new Error('Storage mock error!');
    });
    render(<RoutedApp />);
    const errorElement = await screen.findByRole('alert');
    expect(errorElement).toBeInTheDocument();
    expect(screen.getByText(CHILD_PAGE_TEXT)).toBeInTheDocument();
    expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
  });

  it('shows authenticated-user content only after calling authenticate from child', async () => {
    const user = userEvent.setup();
    render(<RoutedApp />);
    expect(await screen.findByText(/not authenticated/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /authenticate/i }));
    expect(await screen.findByText(/authenticated/i)).toBeInTheDocument();
  });

  it('persists authentication after refresh', async () => {
    render(<RoutedApp />);
    expect(await screen.findByText(/authenticated/i)).toBeInTheDocument();
  });

  it('shows load indicator before render actual page data', async () => {
    render(<RoutedApp />);
    const loader = screen.getByTitle(/loading/i);
    expect(loader).toBeInTheDocument();
    expect(await screen.findByText(CHILD_PAGE_TEXT)).toBeInTheDocument();
    expect(loader).not.toBeInTheDocument();
  });

  it('shows alert on authentication error', async () => {
    const message = 'Bad Request!';
    getSigninValidation.mockImplementationOnce(
      generateGetSigninValidateMock({ data: null, error: { message } }),
    );
    render(<RoutedApp />);
    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it('shows alert on unexpected authentication response', async () => {
    getSigninValidation.mockImplementationOnce(
      generateGetSigninValidateMock({ data: 'true', error: null }),
    );
    render(<RoutedApp />);
    expect(
      await screen.findByText(/authentication failed/i),
    ).toBeInTheDocument();
  });

  it('shows unauthenticated-user content after signing the user out', async () => {
    const user = userEvent.setup();
    render(<RoutedApp />);
    expect(await screen.findByText(/authenticated/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /sign out/i }));
    expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
  });
});
