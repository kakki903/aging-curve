import { useNavigate } from "react-router-dom";

const ButtonForm = ({ name, location }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (location) {
      navigate(location);
    } else {
      console.warn("삐익!!!");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        w-full py-3 px-6 
        bg-indigo-600 hover:bg-indigo-700 
        text-white font-semibold 
        rounded-lg shadow-md 
        transition duration-300 ease-in-out 
        transform hover:scale-[1.02]
        focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50
        text-lg
      "
      aria-label={name}
    >
      {name}
    </button>
  );
};

export default ButtonForm;
