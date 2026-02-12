export async function getAddress() {
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
    });
  });

  const { latitude: lat, longitude: lng } = position.coords;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
  );

  if (!res.ok) {
    throw new Error(`Geocoding failed: ${res.status}`);
  }

  const data = await res.json();

  if (!data.address) {
    throw new Error("Invalid geocoding response");
  }

  return {
    city: data.address.city || data.address.town || data.address.village || "Unknown",
    zip: data.address.postcode || "N/A",
  };
}
