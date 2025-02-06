import { useOutletContext } from 'react-router-dom';
import Products from '../Products/Products';
import Button from '../Button/Button';

function Cart() {
  const { cart } = useOutletContext();

  const totalCost = cart
    .reduce((total, { product, quantity }) => {
      return total + product.price * quantity;
    }, 0)
    .toFixed(2);

  return (
    <>
      <h2>Cart</h2>
      {cart.length < 1 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          <div className="container p-4">
            <p className="flex gap-4 items-center justify-center w-full">
              <span>
                The total cost is{' '}
                <span className="font-bold">{totalCost}$</span>
              </span>
              <Button type="button">Checkout</Button>
            </p>
          </div>
          <Products items={cart} />
        </>
      )}
    </>
  );
}

export default Cart;
