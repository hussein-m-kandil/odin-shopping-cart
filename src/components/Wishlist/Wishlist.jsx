import { useOutletContext } from 'react-router-dom';
import Products from '../Products/Products';

function Wishlist() {
  const { wishlist } = useOutletContext();

  return (
    <>
      <h2>Wishlist</h2>
      {wishlist.length < 1 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <Products items={wishlist} />
      )}
    </>
  );
}

export default Wishlist;
