import { BiLoaderAlt } from 'react-icons/bi';

function Loader() {
  return (
    <span
      aria-label="Loading..."
      className="animate-spin text-4xl text-app-main"
    >
      <BiLoaderAlt />
    </span>
  );
}

export default Loader;
