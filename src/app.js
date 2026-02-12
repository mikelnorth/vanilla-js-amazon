import "./styles/styles.css";
import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import cart from "./state/cart.js";

export function initApp() {
  renderHeader();
  renderFooter();
  cart.updateHeader();
}
