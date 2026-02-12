import { initApp } from "../../app.js";
import { products } from "../../data/products.js";
import { productCard } from "../../components/productCard.js";
import cart from "../../state/cart.js";

const html = String.raw;

function renderProducts(currentProducts = products) {
  const app = document.getElementById("app");
  app.className = "bg-amazon-gray";

  app.innerHTML = html`
    <div
      id="products-grid"
      class="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      ${currentProducts.map((product) => productCard(product)).join("")}
    </div>
  `;
}

// Visual feedback for add to cart button
function showAddedFeedback(button) {
  button.textContent = "Added!";
  button.classList.add("bg-amazon-success");
  setTimeout(() => {
    button.textContent = "Add to Cart";
    button.classList.remove("bg-amazon-success");
  }, 1000);
}

// Event delegation for "Add to Cart" buttons
function setupCartListeners() {
  const app = document.getElementById("app");

  app.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-product-id]");
    if (!button) return;

    const productId = parseInt(button.dataset.productId);
    const product = products.find((p) => p.id === productId);

    if (product) {
      cart.addItem(product);
      showAddedFeedback(button);
    }
  });
}

initApp();
renderProducts();
setupCartListeners();
