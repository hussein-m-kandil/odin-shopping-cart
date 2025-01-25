import '@testing-library/jest-dom/vitest';
import { vi, it, expect, describe, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryRouter,
  Navigate,
  RouterProvider,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App, { SIGNOUT_PATH } from './App';

const AUTH_DATA = { objectId: 'Fake id', 'user-token': 'Fake token' };
const PRIVATE_CONTENT = 'Private content';
const PUBLIC_CONTENT = 'Public content';
const PRIVATE_PATH = '/private';
const PUBLIC_PATH = '/';
const SIGNIN_BTN_CONTENT = 'Sign in';
const SIGNOUT_BTN_CONTENT = 'Sign out';

function PrivatePageMock() {
  const { authenticated } = useOutletContext();
  const navigate = useNavigate();
  return !authenticated ? (
    <Navigate to={PUBLIC_PATH} replace={true} />
  ) : (
    <>
      <h2>{PRIVATE_CONTENT}</h2>
      <button type="button" onClick={() => navigate(SIGNOUT_PATH)}>
        {SIGNOUT_BTN_CONTENT}
      </button>
    </>
  );
}

function PublicPageMock() {
  const { authenticate, authenticated } = useOutletContext();
  return authenticated ? (
    <Navigate to={PRIVATE_PATH} replace={true} />
  ) : (
    <>
      <h2>{PUBLIC_CONTENT}</h2>
      <button type="button" onClick={() => authenticate(AUTH_DATA)}>
        {SIGNIN_BTN_CONTENT}
      </button>
    </>
  );
}

function RoutedApp() {
  return (
    <RouterProvider
      router={createMemoryRouter([
        {
          path: PUBLIC_PATH,
          element: <App />,
          children: [
            {
              path: SIGNOUT_PATH,
              Component: () => {
                const { authenticated } = useOutletContext();
                return authenticated ? (
                  <App />
                ) : (
                  <Navigate to={PUBLIC_PATH} replace={true} />
                );
              },
            },
            { index: true, element: <PublicPageMock /> },
            { path: PRIVATE_PATH, element: <PrivatePageMock /> },
          ],
        },
      ])}
    />
  );
}

vi.mock('./components/Navbar/Navbar', () => ({
  default: () => <div>Navbar</div>,
}));

vi.mock('./components/Footer/Footer', () => ({
  default: () => <div>Footer</div>,
}));

afterEach(() => vi.resetAllMocks());

describe('App', () => {
  it('shows authenticated-user content only after calling authenticate from child', async () => {
    const user = userEvent.setup();
    render(<RoutedApp />);
    expect(await screen.findByText(PUBLIC_CONTENT)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: SIGNIN_BTN_CONTENT }));
    expect(await screen.findByText(PRIVATE_CONTENT)).toBeInTheDocument();
  });

  it('shows unauthenticated-user content after signing the user out', async () => {
    const user = userEvent.setup();
    render(<RoutedApp />);
    expect(screen.getByText(PUBLIC_CONTENT)).toBeInTheDocument();
    expect(screen.queryByText(PRIVATE_CONTENT)).toBeNull();
    await user.click(screen.getByRole('button', SIGNIN_BTN_CONTENT));
    expect(screen.getByText(PRIVATE_CONTENT)).toBeInTheDocument();
    await user.click(screen.getByRole('button', SIGNOUT_BTN_CONTENT));
    expect(screen.queryByText(PRIVATE_CONTENT)).toBeNull();
    expect(screen.getByText(PUBLIC_CONTENT)).toBeInTheDocument();
  });
});
