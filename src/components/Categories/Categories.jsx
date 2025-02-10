import { Link } from 'react-router-dom';
import { CATEGORY_PATH } from '../../App';
import { useEffect, useState } from 'react';
import { getAllCategories } from '../../services/shop';
import PageHeadline from '../PageHeadline/PageHeadline';
import Loader from '../../Loader';

function Categories() {
  const [categories, setCategories] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAllCategories()
      .then(({ data }) => {
        if (mounted) {
          setErrorMessage(null);
          setCategories(data || []);
        }
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage('Failed to get any products!');
      });
    return () => (mounted = false);
  }, []);

  return (
    <>
      <PageHeadline>Categories</PageHeadline>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : categories ? (
        categories.length ? (
          <ul className="p-4 flex flex-col sm:flex-row gap-4 flex-wrap justify-center">
            {categories.map((category) => (
              <li key={category} className="text-center font-bold">
                <Link
                  to={`${CATEGORY_PATH}/${category}`}
                  className="inline-block w-full p-4 rounded-xl bg-app-main text-white active:scale-95"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>There are no categories!</p>
        )
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Categories;
