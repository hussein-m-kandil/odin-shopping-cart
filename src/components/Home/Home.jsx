import { useEffect, useState } from 'react';
import { getAllProducts, getCategory } from '../../services/shop';
import { useOutletContext, useParams } from 'react-router-dom';
import Products from '../Products/Products';
import Loader from '../../Loader';
import PageHeadline from '../PageHeadline/PageHeadline';
import capitalize from '../../utils/capitalize';
import PageTitle from '../../PageTitle';

function Home() {
  const [items, setItems] = useState(null);
  const { cart } = useOutletContext();
  const { category } = useParams();

  const capitalizedCategory = capitalize(category || '');

  useEffect(() => {
    if (!items) {
      let unmounted = false;
      (category ? getCategory(category) : getAllProducts())
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
  }, [items, cart, category]);

  return (
    <>
      <PageTitle pageTitle={capitalizedCategory || 'Home'} />
      <PageHeadline>{capitalizedCategory || 'All Categories'}</PageHeadline>
      {!items ? (
        <Loader />
      ) : items.length < 1 ? (
        <p>Sorry, there are no products! Please visit us later.</p>
      ) : (
        <Products items={items} />
      )}
    </>
  );
}

export default Home;
