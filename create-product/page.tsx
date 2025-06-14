"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type QRCode = {
  ID: string;
  Name: string;
  ShortID: string;
  ShortURL: string;
  LongURL: string;
  QR: string; // Base64 Image
};

export default function Home() {
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("")
  const [products, setProducts] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/products`);

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const generateQR = async () => {
    if (!price) return;
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/generate-product`, 
          {
              name: name,  // Replace with your actual product name
              price: price             // Replace with your actual price
          },
          {
              headers: {
                  "Content-Type": "application/json"
              }
          }
      );
    
      fetchQRCodes(); // Refresh QR list
      setPrice(0);
    } catch (error) {
      console.error("Failed to generate Product", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Product/QR Code Generator</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={generateQR}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        hello QR
        {/* {products.length > 0 &&
          products.map((product) => (
            <div key={product.ID} className="product-card flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-100 hover:shadow-lg transition-shadow">
              <a
                key={product.ID}
                href={product.LongURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-lg font-semibold">{product.Name}</p>
                {product.QR ? (
                  <img
                    src={`data:image/png;base64,${product.QR}`}
                    alt="QR Code"
                    className="w-32 h-32 border p-2 bg-white"
                  />
                ) : (
                  <p className="text-red-500">No QR Code</p>
                )}
                
              </a>
              <p>
                <a 
                  className="text-blue-500 underline hover:text-blue-700" 
                  key={product.ID}
                  href={product.ShortURL} 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{"color":"blue", "textDecoration":"underline"}}
                >
                    {product.ShortURL}
                </a>
              </p>
            </div>
          ))} */}
      </div>
      <style jsx>{`
          .product-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding: 16px;
            border: 12px solid #333;
            border-radius: 12px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s ease-in-out;
            text-align: center;
            width: fit-content;
            margin-top: 1rem;
          }
        
          .product-card:hover {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
      `}</style>
    </div>
  );
}
