import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import "react-toastify/dist/ReactToastify.css";
// Import popup cleaner utility (will auto-execute its initialization)
import "./utils/popupCleaner";

// Force reset all popups in Redux store before rendering
import { resetAllPopups } from "./store/slices/popUpSlice";
store.dispatch(resetAllPopups());

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
