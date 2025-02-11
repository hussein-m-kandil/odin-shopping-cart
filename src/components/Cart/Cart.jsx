import { useOutletContext } from 'react-router-dom';
import PageHeadline from '../PageHeadline/PageHeadline';
import Products from '../Products/Products';
import Button from '../Button/Button';

function Cart() {
  const { cart, checkout } = useOutletContext();

  const totalCost = cart
    .reduce((total, { product, quantity }) => {
      return total + product.price * quantity;
    }, 0)
    .toFixed(2);

  const itemsCount = cart.reduce((sum, { quantity }) => sum + quantity, 0);

  return (
    <>
      <PageHeadline>
        Your Cart Has{` ${itemsCount} Item${itemsCount === 1 ? '' : 's'}`}
      </PageHeadline>
      {cart.length > 0 && (
        <>
          <div className="text-center mb-4 mt-6">
            <Button
              type="button"
              onClick={checkout}
              className="font-semibold text-sm"
            >
              Checkout and Pay <span className="font-bold">{totalCost}$</span>
            </Button>
          </div>
          <Products items={cart} />
        </>
      )}
    </>
  );
}

export default Cart;
