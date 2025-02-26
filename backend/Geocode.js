export async function validateAddress(address) {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      console.log("API Response:", data);
  
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { valid: true, lat, lng };
      } else {
        return { valid: false, lat: null, lng: null };
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
      return { valid: false, lat: null, lng: null };
    }
  }
  