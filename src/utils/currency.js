const format = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(cents) {
  return format.format(cents / 100);
}

export function splitPrice(cents) {
  const parts = format.formatToParts(cents / 100);
  const dollars = parts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("");
  const c = parts.find((p) => p.type === "fraction")?.value ?? "00";
  return { dollars, cents: c };
}

export function perUnit(totalCents, quantity) {
  return Math.round(totalCents / quantity);
}
