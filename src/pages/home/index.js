import { initApp, html } from "../../app.js";
import { products } from "../../data/products.js";
import { productCard } from "../../components/productCard.js";
import cart from "../../state/cart.js";
import { renderSubHeader } from "../../components/subHeader.js";

function filterProducts(currentProducts) {
  let filteredProducts = currentProducts || [];
  const category = new URLSearchParams(window.location.search).get("category");
  const search = new URLSearchParams(window.location.search).get("search");

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category,
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      // Search in product name
      const nameMatch = product.name.toLowerCase().includes(searchLower);

      // Search in keywords array (if it exists)
      const keywordsMatch = product.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchLower),
      );

      return nameMatch || keywordsMatch;
    });
  }

  return filteredProducts;
}

export function renderProducts(currentProducts = products) {
  const app = document.getElementById("app");
  app.className = "bg-amazon-gray";

  const filteredProducts = filterProducts(currentProducts);
  app.innerHTML = html`
    <div
      id="products-grid"
      class="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      ${filteredProducts.map((product) => productCard(product)).join("")}
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
renderSubHeader();
renderProducts();
setupCartListeners();

// Listen for search updates from header
window.addEventListener("searchUpdate", () => {
  renderProducts();
});
