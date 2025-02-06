import '@testing-library/jest-dom/vitest';
import { vi, it, expect, describe, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  createMemoryRouter,
  Link,
  Navigate,
  RouterProvider,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App, { SIGNOUT_PATH, CART_PATH } from './App';
import Products from './components/Products/Products';

const AUTH_DATA = { objectId: 'Fake id', 'user-token': 'Fake token' };
const PRIVATE_CONTENT = 'Private content';
const PUBLIC_CONTENT = 'Public content';
const PRIVATE_PATH = '/private';
const PUBLIC_PATH = '/';
const SIGNIN_BTN_CONTENT = 'Sign in';
const SIGNOUT_BTN_CONTENT = 'Sign out';

const items = [
  {
    product: {
      id: 1,
      title: 'Fja No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest.',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    quantity: 0,
  },
  {
    product: {
      id: 2,
      title: 'Mens Casual Premium Slim Fit T-Shirts',
      price: 22.3,
      description:
        'Slim-fitting style, contrast raglan long sleeve, three-button henley placket.',
      category: "men's clothing",
      image:
        'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    quantity: 0,
  },
];

function PrivatePageMock() {
  const { authenticated } = useOutletContext();
  const navigate = useNavigate();
  return !authenticated ? (
    <Navigate to={PUBLIC_PATH} replace={true} />
  ) : (
    <>
      <h2>
        {PRIVATE_CONTENT}
        <button type="button" onClick={() => navigate(SIGNOUT_PATH)}>
          {SIGNOUT_BTN_CONTENT}
        </button>
      </h2>
    </>
  );
}

function PublicPageMock() {
  const { authenticate, authenticated } = useOutletContext();
  return authenticated ? (
    <Navigate to={PRIVATE_PATH} replace={true} />
  ) : (
    <>
      <h2>
        {PUBLIC_CONTENT}
        <button type="button" onClick={() => authenticate(AUTH_DATA)}>
          {SIGNIN_BTN_CONTENT}
        </button>
        <Link to={CART_PATH}>Cart</Link>
      </h2>
      <Products items={items} />
    </>
  );
}

function CartMock() {
  const { cart } = useOutletContext();
  return <Products items={cart} />;
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
            { path: CART_PATH, element: <CartMock /> },
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
    await user.click(screen.getByRole('button', { name: SIGNIN_BTN_CONTENT }));
    expect(screen.getByText(PRIVATE_CONTENT)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: SIGNOUT_BTN_CONTENT }));
    expect(screen.queryByText(PRIVATE_CONTENT)).toBeNull();
    expect(screen.getByText(PUBLIC_CONTENT)).toBeInTheDocument();
  });
});

describe('App Products', () => {
  it('gets rendered correctly', () => {
    render(<RoutedApp />);
    for (const { product } of items) {
      expect(screen.getByText(product.title)).toBeInTheDocument();
      expect(screen.getByAltText(product.title)).toBeInTheDocument();
      expect(screen.getByText(product.description)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(product.price))).toBeInTheDocument();
    }
    expect(
      screen.getAllByRole('button', { name: /add to cart/i }),
    ).toHaveLength(items.length);
  });
});

describe('App Cart', () => {
  it('gets the added products', async () => {
    const user = userEvent.setup();
    render(<RoutedApp />);
    for (const btn of await screen.findAllByRole('button', {
      name: /add to cart/i,
    })) {
      await user.click(btn);
    }
    for (const btn of screen.getAllByLabelText(/increment/i)) {
      await user.click(btn);
    }
    await user.click(screen.getByRole('link', { name: /cart/i }));
    const quantityInputs = screen.getAllByRole('textbox', {
      name: /quantity/i,
    });
    expect(quantityInputs).toHaveLength(items.length);
    quantityInputs.forEach((inp) => expect(inp).toHaveValue('2'));
    items.forEach(({ product }) =>
      expect(
        screen.getByText(new RegExp(product.price * 2)),
      ).toBeInTheDocument(),
    );
  });

  it('gets updated correctly and maintain the order of the products', async () => {
    const user = userEvent.setup();
    render(<RoutedApp />);
    const addBtns = await screen.findAllByRole('button', {
      name: /add to cart/i,
    });
    for (const btn of addBtns) await user.click(btn);
    const incrementBtns = screen.getAllByLabelText(/increment/i);
    for (const btn of incrementBtns) await user.click(btn);
    await user.click(screen.getByRole('link', { name: /cart/i }));
    await user.click(screen.getAllByLabelText(/decrement/i)[0]);
    await user.click(screen.getAllByLabelText(/increment/i)[1]);
    expect(
      screen.getAllByRole('textbox', { name: /quantity/i })[0],
    ).toHaveValue('1');
    expect(
      screen.getByText(new RegExp(items[0].product.price)),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('textbox', { name: /quantity/i })[1],
    ).toHaveValue('3');
    expect(
      screen.getByText(new RegExp(items[1].product.price * 3)),
    ).toBeInTheDocument();
    await user.click(screen.getAllByLabelText(/decrement/i)[1]);
    await user.click(screen.getAllByLabelText(/decrement/i)[1]);
    const quantityInput = screen.getAllByRole('textbox', {
      name: /quantity/i,
    })[0];
    await user.type(quantityInput, '0', {
      initialSelectionStart: 0,
      initialSelectionEnd: quantityInput.value.length,
    });
    await user.click(screen.getAllByLabelText(/decrement/i)[0]);
    expect(
      screen.queryAllByRole('textbox', { name: /quantity/i }),
    ).toHaveLength(0);
    expect(screen.queryAllByLabelText(/increment/i)).toHaveLength(0);
    expect(screen.queryAllByLabelText(/decrement/i)).toHaveLength(0);
  });
});
