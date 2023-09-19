import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    fetchData().then((data) => {setProducts(data)});
  }, [])

  const fetchData = async () => {
    try {
      const api = "https://my-json-server.typicode.com/benirvingplt/products/products";
      const response = await fetch(api);
      const data = await response?.json();

      const productsWithQuantity = data?.map(product => ({
        ...product,
        quantity: 0,
      }))

      return productsWithQuantity;
      // return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const addToBasket = (product) => {
    const updatedBasket = [...basket];
    const itemIndex = updatedBasket.find(item => item.id === product.id);
    if (itemIndex) {
      itemIndex.quantity++;
    } else {
      updatedBasket.push({ ...product, quantity: 1 })
    }
    setBasket(updatedBasket);
  }

  const reduceQuantity = (product) => {
    const updatedBasket = [...basket];
    const itemIndex = updatedBasket.find(item => item.id === product.id);

    if (itemIndex) {
      if (itemIndex.quantity > 1) {
        itemIndex.quantity--;
      } else {
        const itemIndex = updatedBasket.find(item => item.id === product.id);
        if (itemIndex !== -1) {
          updatedBasket.splice(itemIndex, 1);
        }
      }

      setBasket(updatedBasket)
    }
  }

  const removeFromBasket = (product) => {
    const updatedBasket = basket.filter(item => item.id !== product);
    setBasket(updatedBasket);
  }

  return (
    <>
      <div>
        <h1>Product Listing</h1>
        <div>
          {products
            .filter(product => product.colour === selectedColor)
            .map(product => (
              <div key={product.id} style={{ display: "flex", marginBottom: "20px" }}>
                <img src={product.img} alt={product.name} width="150px" height="150px" style={{ paddingTop: "30px", marginRight: "30px" }} />
                <div>
                  <h3>{product.name}</h3>
                  <div style={{display:"flex", gap:"200px"}}>
                    <div>
                      <p>Price: ${product.price}</p>
                      <p>Colour: {product.colour}</p>
                    </div>
                    <div style={{marginTop:"12px"}}>
                      <button onClick={() => addToBasket(product)}>+</button>
                      <button onClick={() => reduceQuantity(product)}>-</button>
                      <br/>
                      <br/>
                      <button onClick={() => removeFromBasket(product.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <h2>Shopping Cart</h2>
        <ul>
          {basket.map(cartItem => (
            <li key={cartItem.id}>{cartItem.name} - Quantity: {cartItem.quantity}</li>
          ))}
        </ul>
        <select onChange={((e) => setSelectedColor(e.target.value))} style={{ position: "absolute", top: "0" }}>
          <option value="Black">Black</option>
          <option value="Stone">Stone</option>
          <option value="Red">Red</option>
        </select>
      </div>

    </>
  );
}

export default App;
