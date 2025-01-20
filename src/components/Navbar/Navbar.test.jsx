import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  getByRole,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar.jsx';
import PropTypes from 'prop-types';

/**
 * Asynchronous function that changes the screen's width,
 * and fires 'resize' event on the window object.
 *
 * @param {number} width - The new screen width. Defaults to 300
 * @returns {function} - Asynchronous screen width resetter
 */
async function changeScreenWidth(width = 480) {
  const initScreenWidth = window.innerWidth;
  window.innerWidth = width;
  await fireEvent(window, new Event('resize'));
  return async () => await changeScreenWidth(initScreenWidth);
}

function RoutedNavbar({
  routerOptions = {
    initialEntries: ['/'],
    initialIndex: 0,
  },
  ...props
}) {
  return (
    <RouterProvider
      router={createMemoryRouter(
        [{ path: '*', element: <Navbar {...props} /> }],
        routerOptions,
      )}
    />
  );
}

RoutedNavbar.propTypes = {
  routerOptions: PropTypes.shape({
    initialEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number.isRequired,
  }),
};

describe('Navbar', () => {
  it('renders  appropriately at the root route', () => {
    const { container } = render(<RoutedNavbar />);
    expect(container).toMatchSnapshot();
  });

  it('renders appropriately at a non-root route', () => {
    const { container } = render(
      <RoutedNavbar
        routerOptions={{
          initialEntries: ['/cart'],
          initialIndex: 0,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders appropriately for an authenticated user', () => {
    const { container } = render(<RoutedNavbar authenticated={true} />);
    expect(container).toMatchSnapshot();
  });
});

describe('Navbar content', () => {
  it('contains heading only at the root route', () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
    cleanup();
    render(
      <RoutedNavbar
        routerOptions={{
          initialEntries: ['/cart'],
          initialIndex: 0,
        }}
      />,
    );
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('contains a single nav menu', () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('contains multiple nav items', () => {
    render(<RoutedNavbar />);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('does not contain the toggler on a wide screen', () => {
    render(<RoutedNavbar />);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeNull();
  });

  it('contains the toggler in place of the nav menu/links on a narrow screen', async () => {
    const resetScreenWidth = await changeScreenWidth();
    render(<RoutedNavbar />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    expect(
      screen.queryByRole('button', {
        name: 'Toggle navigation menu',
      }),
    ).toBeInTheDocument();
    await resetScreenWidth();
  });

  it('contain the toggler dynamically based on screen width', async () => {
    render(<RoutedNavbar />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeNull();
    const resetScreenWidth = await changeScreenWidth();
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeInTheDocument();
    await resetScreenWidth();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: 'Toggle navigation menu' }),
    ).toBeNull();
  });

  it('contains the appropriate nav items for an unauthenticated user', () => {
    render(<RoutedNavbar authenticated={false} />);
    expect(screen.queryByRole('link', { name: 'Sign out' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Cart' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('contains the appropriate nav items for an authenticated user', () => {
    render(<RoutedNavbar authenticated={true} />);
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Sign up' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cart' })).toBeInTheDocument();
  });
});

describe('Navbar menu toggler', () => {
  it('toggles the nav menu', async () => {
    const resetScreenWidth = await changeScreenWidth();
    const user = userEvent.setup();
    render(<RoutedNavbar />);
    const toggler = screen.queryByRole('button', {
      name: 'Toggle navigation menu',
    });
    expect(toggler.ariaExpanded).toBe('false');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    await user.click(toggler);
    expect(toggler.ariaExpanded).toBe('true');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(toggler.getAttribute('aria-controls')).toBe(
      screen.getByRole('list').id,
    );
    await user.click(toggler);
    expect(toggler.ariaExpanded).toBe('false');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem').length).toBe(0);
    await resetScreenWidth();
  });
});

describe('Navbar menu on a small screen', () => {
  it('removed when a nav link is clicked', async () => {
    const resetScreenWidth = await changeScreenWidth();
    const user = userEvent.setup();
    render(<RoutedNavbar authenticated={true} />);
    expect(screen.queryByRole('list')).toBeNull();
    const toggler = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    });
    // Click on first nav link (based on the navbar structure for an authenticated user)
    await user.click(toggler);
    expect(screen.getByRole('list')).toBeInTheDocument();
    const navItems = screen.getAllByRole('listitem');
    await user.click(getByRole(navItems[0], 'link'));
    expect(screen.queryByRole('list')).toBeNull();
    await resetScreenWidth();
  });

  it('removed on a click outside the navbar', async () => {
    const resetScreenWidth = await changeScreenWidth();
    const user = userEvent.setup();
    render(<RoutedNavbar authenticated={true} />);
    expect(screen.queryByRole('list')).toBeNull();
    const toggler = screen.getByRole('button', {
      name: 'Toggle navigation menu',
    });
    await user.click(toggler);
    expect(screen.getByRole('list')).toBeInTheDocument();
    await user.click(window.document.body);
    expect(screen.queryByRole('list')).toBeNull();
    await resetScreenWidth();
  });
});
