const html = String.raw;

export function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "bg-amazon-footer text-white mt-auto";

  footer.innerHTML = html`
    <div class="bg-amazon-nav-secondary text-center py-4">
      <button
        onclick="window.scrollTo({top: 0, behavior: 'smooth'})"
        class="text-sm cursor-pointer"
      >
        Back to top
      </button>
    </div>

    <div class="bg-amazon-subnav py-10">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="font-bold text-base mb-3">Get to Know Us</h3>
          <ul class="space-y-2 text-sm text-amazon-text-tertiary">
            <li><a href="#" class="hover:underline">About Us</a></li>
            <li><a href="#" class="hover:underline">Careers</a></li>
            <li><a href="#" class="hover:underline">Press Releases</a></li>
            <li><a href="#" class="hover:underline">Amazon Science</a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-base mb-3">Make Money with Us</h3>
          <ul class="space-y-2 text-sm text-amazon-text-tertiary">
            <li><a href="#" class="hover:underline">Sell on Amazon</a></li>
            <li><a href="#" class="hover:underline">Sell apps on Amazon</a></li>
            <li><a href="#" class="hover:underline">Become an Affiliate</a></li>
            <li>
              <a href="#" class="hover:underline">Advertise Your Products</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-base mb-3">Amazon Payment Products</h3>
          <ul class="space-y-2 text-sm text-amazon-text-tertiary">
            <li><a href="#" class="hover:underline">Amazon Rewards Visa</a></li>
            <li><a href="#" class="hover:underline">Amazon Store Card</a></li>
            <li>
              <a href="#" class="hover:underline">Amazon Business Card</a>
            </li>
            <li><a href="#" class="hover:underline">Shop with Points</a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-base mb-3">Let Us Help You</h3>
          <ul class="space-y-2 text-sm text-amazon-text-tertiary">
            <li><a href="#" class="hover:underline">Your Account</a></li>
            <li><a href="#" class="hover:underline">Your Orders</a></li>
            <li>
              <a href="#" class="hover:underline">Shipping Rates & Policies</a>
            </li>
            <li>
              <a href="#" class="hover:underline">Returns & Replacements</a>
            </li>
            <li><a href="#" class="hover:underline">Help</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-amazon-header py-6">
      <div
        class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-2">
          <span class="nav-sprite nav-logo"></span>
        </div>
        <div class="flex gap-6 text-sm text-amazon-text-tertiary">
          <a href="#" class="hover:underline">Conditions of Use</a>
          <a href="#" class="hover:underline">Privacy Notice</a>
          <a href="#" class="hover:underline">Your Ads Privacy Choices</a>
        </div>
      </div>
      <div class="text-center mt-4 text-xs text-amazon-text-tertiary">
        © 1996-2026, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}
