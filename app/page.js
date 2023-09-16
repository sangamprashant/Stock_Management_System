"use client"
import Loading from "@components/Loading";
import { useEffect, useState } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({
    slug: "",
    quantity: "",
    price: "",
  });
  const [products, setProducts] = useState([]);
  const [dropdown, setDropdown] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.Products);
      } else {
        console.error("Error in fetching products.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInput = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handelAdd = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        console.log("Product added successfully.");
        setProductForm({ slug: "", quantity: "", price: "" });
        fetchData();
      } else {
        console.error("Error in adding product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onDropDown = async (e) => {
    const queryValue = e.target.value;
    setQuery(queryValue);
    if (!loading) {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?query=${queryValue}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDropdown(data.Products);
        } else {
          console.error("Error in searching products.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const ButtonAction = async (action, item, currentQuantity) => {
    try {
      // Calculate the new quantity based on the action
      const newQuantity = action === "add" ? parseInt(currentQuantity) + 1 : parseInt(currentQuantity) - 1;
  
      const response = await fetch("/api/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({itemId:item, newQuantity }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Error in adding product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="container mx-auto">
      {/* Search */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-2 mx-auto">
          <div className="flex flex-col text-center w-full">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Search A Product
            </h1>
          </div>
          <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
            <div className="relative flex-grow w-full">
              <label htmlFor="product-name" className="leading-7 text-sm text-gray-600">
                Product Name
              </label>
              <input
                type="text"
                id="product-name"
                name="product-name"
                onChange={onDropDown}
                value={query}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative flex-grow w-full">
              <label htmlFor="product-category" className="leading-7 text-sm text-gray-600">
                Product Category
              </label>
              <select
                id="product-category"
                name="product-category"
                className="w-full h-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              >
                <option value="">All</option>
                {/* Add your product categories here */}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Display Search Results */}
      {dropdown.length > 0 && (
        <div className="container mx-auto">
          <section className="text-gray-600 body-font absolute w-full" style={{ zIndex: "1" }}>
            <div className="container px-5">
              {!loading ? (
                <div className="lg:w-2/3 w-full mx-auto overflow-auto bg-red">
                  <table className="table-auto w-full text-left whitespace-no-wrap bg-red-100">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                          Product Name
                        </th>
                        <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                          Add
                        </th>
                        <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                          Quantity
                        </th>
                        <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dropdown.map((item) => (
                        <tr className="border border-black" key={item._id}>
                          <td className="px-4 py-3">
                            {item.slug} {item.quantity} available for ₹{item.price}
                          </td>
                          <td onClick={()=>{ButtonAction("minus", item.slug, item.quantity)}} className="px-4 py-3 bg-purple-300 text-center rounded-xxl">-</td>
                          <td className="px-4 text-center py-3">{item.quantity}</td>
                          <td onClick={()=>{ButtonAction("add", item.slug, item.quantity)}} className="px-4 bg-purple-300 text-center rounded-xxl py-3">+</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex lg:w-2/3 w-full flex-row mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 justify-center">
                  <Loading />
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      
      {/* Product input */}
      <section className="text-gray-600 body-font my-12">
        <div className="container px-5 py-2 mx-auto">
          <div className="flex flex-col text-center w-full ">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Add A Product
            </h1>
          </div>
          <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
            <div className="relative flex-grow w-full">
              <label
                htmlFor="product-name"
                className="leading-7 text-sm text-gray-600"
              >
                {" "}
                Product Slug
              </label>
              <input
                type="text"
                id="product-name"
                name="slug"
                onChange={handleInput}
                value={productForm?.slug || ""}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative flex-grow w-full">
              <label
                htmlFor="quantity"
                className="leading-7 text-sm text-gray-600"
              >
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                onChange={handleInput}
                value={productForm?.quantity || ""}
                name="quantity"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative flex-grow w-full">
              <label
                htmlFor="price"
                className="leading-7 text-sm text-gray-600"
              >
                Price
              </label>
              <input
                type="price"
                onChange={handleInput}
                value={productForm?.price || ""}
                id="price"
                name="price"
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              onClick={handelAdd}
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Button
            </button>
          </div>
        </div>
      </section>

      {/* display Stock */}
      <section className="text-gray-600 body-font">
        <div className="container px-1 py-2 mx-auto">
          <div className="flex flex-col text-center w-full ">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
              Current Stock
            </h1>
          </div>
          <div className="lg:w-2/3 w-full mx-auto overflow-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                    Product Name
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    Quantity
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-3">{product.slug}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3">₹{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex pl-4 mt-4 lg:w-2/3 w-full mx-auto">
            <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">
              Learn More
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
            <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
              Button
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
