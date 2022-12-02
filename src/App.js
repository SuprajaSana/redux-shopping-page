import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiActions } from "./store/ui";
import { cartActions } from "./store/cart";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";

let initialState = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const changed = useSelector((state) => state.cart.changed);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pendimg...",
          title: "Sending",
          message: "Sending cart data",
        })
      );
      const response = await fetch(
        "https://redux-first-ac4cc-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data sucessfully",
        })
      );
    };

    if (initialState) {
      initialState = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Sending cart data failed",
        })
      );
    });
  }, [cart, dispatch]);

  useEffect(() => {
    const fetchCartData = async () => {
      const response = await fetch(
        "https://redux-first-ac4cc-default-rtdb.firebaseio.com/cart.json"
      );

      const data = await response.json();
      dispatch(cartActions.replaceCart(data));

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    };
    fetchCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Fetching cart data failed",
        })
      );
    });
  }, [dispatch]);

  return (
    <Fragment>
      {notification && changed && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        ></Notification>
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
