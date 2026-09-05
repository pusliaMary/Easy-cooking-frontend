import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      pauseOnHover={false}
      newestOnTop
    />
  );
};
