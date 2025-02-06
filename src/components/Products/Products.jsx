import PropTypes from 'prop-types';
import ProductCard, { ItemType } from '../ProductCard/ProductCard';

function Products({ items }) {
  return (
    <div className="container flex flex-wrap w-full px-2">
      {items.map((item) => (
        <ProductCard key={item.product?.id || item.id} item={item} />
      ))}
    </div>
  );
}

Products.propTypes = { items: PropTypes.arrayOf(ItemType) };

export default Products;
