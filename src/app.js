import "./styles/styles.css";
import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";

export function initApp() {
  // Render common components
  renderHeader();
  renderFooter();
  
  // Add any global event listeners or setup here
  // e.g., global error handlers, analytics, etc.
}
