// Test script to verify the most sold products endpoint
const http = require("http");

function testMostSoldEndpoint() {
  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/products/most-sold?limit=8",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Status Code:", res.statusCode);
      console.log("Response Headers:", res.headers);

      if (res.statusCode === 200) {
        try {
          const products = JSON.parse(data);
          console.log(
            "✅ Success! Found",
            products.length,
            "most sold products"
          );
          console.log(
            "Sample product:",
            products[0]
              ? {
                  name: products[0].name,
                  price: products[0].price,
                  featured: products[0].featured,
                  rating: products[0].rating,
                }
              : "No products found"
          );
        } catch (error) {
          console.log("❌ Failed to parse JSON response:", error.message);
          console.log("Raw response:", data);
        }
      } else {
        console.log("❌ Request failed with status:", res.statusCode);
        console.log("Response:", data);
      }
    });
  });

  req.on("error", (error) => {
    console.log("❌ Request error:", error.message);
    console.log("Make sure the server is running on port 5000");
  });

  req.setTimeout(5000, () => {
    console.log("❌ Request timeout after 5 seconds");
    req.destroy();
  });

  req.end();
}

console.log("🧪 Testing Most Sold Products Endpoint...");
console.log("Endpoint: GET /api/products/most-sold?limit=8");
console.log(
  "Expected: Array of 8 most popular products sorted by rating and featured status"
);
console.log("---");

testMostSoldEndpoint();
