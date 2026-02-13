import { html } from "../app.js";
import { products } from "../data/products.js";

const getAvailableCategories = () => {
  return Array.from(new Set(products.map((product) => product.category)));
};

export function renderSubHeader() {
  const currentCategory = new URLSearchParams(window.location.search).get(
    "category",
  );

  const subHeader = document.createElement("div");
  subHeader.className =
    "bg-amazon-subnav text-white px-6 py-3 flex items-center gap-6";
  subHeader.innerHTML = html`
    <div class="flex items-center gap-6">
      <a
        href="${import.meta.env.BASE_URL}src/pages/home/"
        class="hover:text-amazon-search"
        >All Products</a
      >
      ${getAvailableCategories()
        .map(
          (category) => html`
            <a
              href="${import.meta.env
                .BASE_URL}src/pages/home/?category=${encodeURIComponent(
                category,
              )}"
              class="${currentCategory === category
                ? "text-amazon-search"
                : "hover:text-amazon-search"}"
            >
              ${category}
            </a>
          `,
        )
        .join("")}
    </div>
  `;

  // add after header
  const header = document.querySelector("header");
  header.after(subHeader);
}
