export async function getAddress() {
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  const { latitude: lat, longitude: lng } = position.coords;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
  );
  const data = await res.json();
  const address = data.address;

  return {
    city: address.city || address.town || address.village,
    zip: address.postcode,
  };
}
