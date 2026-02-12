export function renderStars(average) {
  const fullStars = Math.floor(average);
  const hasHalf = average % 1 >= 0.5;
  let stars = "";
  for (let i = 0; i < fullStars; i++) stars += "&#9733;";
  if (hasHalf) stars += "&#9734;";
  return stars;
}
