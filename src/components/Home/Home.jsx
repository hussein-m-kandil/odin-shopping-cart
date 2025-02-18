import { useEffect, useState } from 'react';
import { cacheData, getCachedData } from '../../utils/caching';
import { getAllProducts, getCategory } from '../../services/shop';
import { useOutletContext, useParams } from 'react-router-dom';
import Products from '../Products/Products';
import Loader from '../../Loader';
import PageHeadline from '../PageHeadline/PageHeadline';
import capitalize from '../../utils/capitalize';
import PageTitle from '../../PageTitle';

const mapProductsToCartItems = (products, cart) => {
  return products.map((product) => {
    const i = cart.findIndex((item) => item.product.id === product.id);
    const quantity = i > -1 ? cart[i].quantity : 0;
    return { product, quantity };
  });
};

function Home() {
  const [items, setItems] = useState(null);
  const { cart } = useOutletContext();
  const { category } = useParams();

  const capitalizedCategory = capitalize(category || '');

  const cachingKey = `${category ? category.replace(/[^\w]/g, '_') : 'all_categories'}_products`;

  useEffect(() => {
    const cachingLifeTime = 10 * 60 * 1000;
    const cachedProducts = getCachedData(cachingKey, cachingLifeTime);
    if (cachedProducts) {
      setItems(mapProductsToCartItems(cachedProducts, cart));
    } else {
      let unmounted = false;
      (category ? getCategory(category) : getAllProducts())
        .then(({ data, error }) => {
          if (!unmounted) {
            if (data) {
              cacheData(cachingKey, data);
              setItems(mapProductsToCartItems(data, cart));
            } else throw error;
          }
        })
        .catch((error) => {
          console.log(error);
          setItems([]);
        });
      return () => (unmounted = true);
    }
  }, [cart, category, cachingKey]);

  return (
    <>
      <PageTitle pageTitle={capitalizedCategory || 'Home'} />
      <PageHeadline>{capitalizedCategory || 'All Categories'}</PageHeadline>
      {!items ? (
        <Loader />
      ) : items.length < 1 ? (
        <p className="text-center">
          Sorry, there are no products! Please visit us later.
        </p>
      ) : (
        <Products items={items} />
      )}
    </>
  );
}

export default Home;
