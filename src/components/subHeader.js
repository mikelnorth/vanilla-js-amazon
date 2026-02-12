const html = String.raw;

export function renderSubHeader() {
  const subHeader = document.createElement("div");
  subHeader.className =
    "bg-amazon-subnav text-white px-6 py-3 flex items-center gap-6";
  subHeader.innerHTML = html`
    <div class="flex items-center gap-6">
      <a href="/" class="hover:text-amazon-search">Products</a>
    </div>
  `;
  document.body.prepend(subHeader);
}

renderSubHeader();
