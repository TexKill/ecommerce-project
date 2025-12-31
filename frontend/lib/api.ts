const API_URL = "http://localhost:3000/api";

export const fetchProducts = async () => {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};
