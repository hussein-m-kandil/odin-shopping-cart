import {
  BsStar,
  BsStarHalf,
  BsStarFill,
  BsHeartFill,
  BsHeart,
} from 'react-icons/bs';
import { useOutletContext } from 'react-router-dom';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

function ProductCard({ item }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const { product } = item;

  const { updateCart, wishlist, updateWishlist } = useOutletContext();

  const inWishlist = Boolean(
    wishlist.find((wishItem) => wishItem.product.id === product.id),
  );

  const rate = product.rating.rate;

  const updateQuantity = (updatedQuantity) => {
    if (updatedQuantity >= 0 && updatedQuantity <= Number.MAX_SAFE_INTEGER) {
      setQuantity(updatedQuantity);
      updateCart(product, updatedQuantity);
    }
  };

  const handleQuantityChange = (e) => {
    if (/\d+/.test(e.target.value)) {
      updateQuantity(parseInt(e.target.value));
    }
  };

  return (
    <div
      className="w-full sm:w-1/2 md:w-1/4 xl:w-1/6 p-2"
      title={product.title}
    >
      <div className="bg-app-light rounded-2xl shadow-md overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-64 sm:h-48 md:h-32 min-w-full object-cover object-top"
        />
        <div className="p-2 pb-4 text-xs">
          <h3 className="font-bold line-clamp-1">{product.title}</h3>
          <p className="text-app-main font-light text-end">
            {product.category}
          </p>
          <p className="line-clamp-2 opacity-75 font-light my-2">
            {product.description}
          </p>
          <div className="flex flex-wrap">
            <span className="flex gap-1">
              <span className="text-app-rating">
                {(rate >= 4 && <BsStarFill />) ||
                  (rate >= 2 && <BsStarHalf />) || <BsStar />}
              </span>
              <span className="font-light">{rate}</span>
            </span>
            <span className="ms-auto font-semibold">
              {(product.price * (quantity || 1)).toFixed(2)}$
            </span>
          </div>
          <div className="mt-2 font-semibold flex gap-2 justify-between *:grow">
            <label className="inline-block max-w-1/4 min-w-[2rem] h-[2rem] text-[1.8rem] overflow-hidden relative">
              <input
                className="appearance-none"
                type="checkbox"
                aria-label="Add to wishlist"
                id={`add-to-wishlist-${product.id}`}
                onChange={() => updateWishlist(item)}
                checked={inWishlist}
              />
              <span className="absolute top-1/2 left-1/2 -translate-1/2 opacity-70 text-red-700">
                {inWishlist ? <BsHeartFill /> : <BsHeart />}
              </span>
            </label>
            {quantity < 1 ? (
              <Button type="button" onClick={() => updateQuantity(1)}>
                Add to Cart
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  aria-label="decrement"
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  <BiMinus className="stroke-2 inline" />
                </Button>
                <input
                  type="text"
                  value={quantity}
                  aria-label="quantity"
                  id={`quantity-${product.id}`}
                  onChange={handleQuantityChange}
                  className="w-8 text-center focus:outline-1 outline-gray-400 border-1 border-gray-300 rounded-lg"
                />
                <Button
                  type="button"
                  aria-label="increment"
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  <BiPlus className="stroke-2 inline" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductType = PropTypes.shape({
  id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  image: PropTypes.string,
  rating: PropTypes.shape({
    rate: PropTypes.number,
    count: PropTypes.number,
  }).isRequired,
}).isRequired;

export const ItemType = PropTypes.shape({
  product: ProductType,
  quantity: PropTypes.number,
});

ProductCard.propTypes = { item: ItemType };

export default ProductCard;
