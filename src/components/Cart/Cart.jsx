import { useOutletContext } from 'react-router-dom';
import PageHeadline from '../PageHeadline/PageHeadline';
import Products from '../Products/Products';
import Button from '../Button/Button';

function Cart() {
  const { cart } = useOutletContext();

  const totalCost = cart
    .reduce((total, { product, quantity }) => {
      return total + product.price * quantity;
    }, 0)
    .toFixed(2);

  const itemsCount = cart.reduce((sum, { quantity }) => sum + quantity, 0);

  return (
    <>
      <PageHeadline>Cart</PageHeadline>
      <p className="text-center text-gray-700 font-light">{`${itemsCount} item${itemsCount === 1 ? '' : 's'}`}</p>
      {cart.length > 0 && (
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
