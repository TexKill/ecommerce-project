import { fetchProducts } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export default async function Home() {
  const products: Product[] = await fetchProducts();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Каталог товарів</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.category}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">
                {product.price} грн
              </span>
              <span
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `В наявності: ${product.stock}`
                  : "Немає в наявності"}
              </span>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
              Додати в кошик
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
