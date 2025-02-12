import { useOutletContext } from 'react-router-dom';
import PageHeadline from '../PageHeadline/PageHeadline';
import Products from '../Products/Products';

function Wishlist() {
  const { wishlist } = useOutletContext();

  const itemsCount = wishlist.length;

  return (
    <>
      <PageHeadline>
        Your Wishlist Has{` ${itemsCount} item${itemsCount === 1 ? '' : 's'}`}
      </PageHeadline>
      {wishlist.length > 0 && <Products items={wishlist} />}
    </>
  );
}

export default Wishlist;
