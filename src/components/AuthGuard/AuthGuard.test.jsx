import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Guard from './AuthGuard';
import PropTypes from 'prop-types';

const publicContent = 'Public';
const privateContent = 'Private';
const publicRoute = { index: true, element: <div>{publicContent}</div> };
const privateRoute = { path: '/private', element: <div>{privateContent}</div> };

function RoutedGuard({
  context,
  routerOptions = { initialEntries: [privateRoute.path], initialIndex: 0 },
}) {
  return (
    <RouterProvider
      router={createMemoryRouter(
        [
          {
            path: '/',
            element: <Outlet context={context} />,
            children: [
              publicRoute,
              {
                element: <Guard authPath={'/'} />,
                children: [privateRoute],
              },
            ],
          },
        ],
        routerOptions,
      )}
    />
  );
}

RoutedGuard.propTypes = {
  context: PropTypes.shape({
    authenticated: PropTypes.bool.isRequired,
  }).isRequired,
  routerOptions: PropTypes.shape({
    initialEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number.isRequired,
  }),
};

describe('Guard', () => {
  it('does redirect to public route on unauthenticated request', () => {
    render(<RoutedGuard context={{ authenticated: false }} />);
    expect(screen.queryByText(privateContent)).toBeNull();
    expect(screen.getByText(publicContent)).toBeInTheDocument();
  });

  it('does not redirect to public route on unauthenticated request', () => {
    render(<RoutedGuard context={{ authenticated: true }} />);
    expect(screen.queryByText(publicContent)).toBeNull();
    expect(screen.getByText(privateContent)).toBeInTheDocument();
  });
});
