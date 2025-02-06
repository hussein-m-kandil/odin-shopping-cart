import { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/shop';
import { useOutletContext } from 'react-router-dom';
import Products from '../Products/Products';
import Loader from '../../Loader';

function Home() {
  const [items, setItems] = useState(null);
  const { cart } = useOutletContext();

  useEffect(() => {
    if (!items) {
      let unmounted = false;
      getAllProducts()
        .then(({ data, error }) => {
          if (!unmounted) {
            if (data) {
              setItems(
                data.map((product) => {
                  const i = cart.findIndex(
                    (item) => item.product.id === product.id,
                  );
                  const quantity = i > -1 ? cart[i].quantity : 0;
                  return { product, quantity };
                }),
              );
            } else throw error;
          }
        })
        .catch((error) => {
          console.log(error);
          setItems([]);
        });
      return () => (unmounted = true);
    }
  }, [items, cart]);

  return !items ? (
    <Loader />
  ) : items.length < 1 ? (
    <p>Sorry, there are no products! Please visit us later.</p>
  ) : (
    <Products items={items} />
  );
}

export default Home;
