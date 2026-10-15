import { useEffect, useState } from "react";
const CartPage = ({
  items = []
}) => {
  const [cartItems, setCartItems] = useState([]);

  // Initialize cart items with safe quantity
  useEffect(() => {
    const safeItems = items.map(item => ({
      ...item,
      quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1
    }));
    setCartItems(safeItems);
  }, [items]);
  const incrementQty = index => {
    setCartItems(prevItems => prevItems.map((item, i) => i === index ? {
      ...item,
      quantity: item.quantity + 1
    } : item));
  };
  const decrementQty = index => {
    setCartItems(prevItems => prevItems.map((item, i) => i === index ? {
      ...item,
      quantity: item.quantity - 1
    } : item).filter(item => item.quantity > 0));
  };
  const handleQtyChange = (index, value) => {
    const newQty = Math.max(1, parseInt(value) || 1);
    setCartItems(prevItems => prevItems.map((item, i) => i === index ? {
      ...item,
      quantity: newQty
    } : item));
  };
  const removeItem = index => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return <div className="p-6 max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-green-600 mb-6">🛒 Your Cart</h2>

    {cartItems.length === 0 ? <p className="text-lg text-gray-700">Your cart is empty.</p> : <>
      <div className="grid gap-5">
        {cartItems.map((item, index) => <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-2/3">
            <img src={item.image || ""} alt={item.name} className="w-24 h-24 object-cover rounded-lg border border-green-500" />
            <div>
              <h3 className="text-xl font-semibold text-green-800">
                {item.name}
              </h3>
              <p className="text-green-700 font-medium">₹{item.price}</p>
            </div>
          </div>

          <div className="flex items-center mt-4 md:mt-0 gap-2">
            <button onClick={() => decrementQty(index)} className="bg-green-300 text-green-900 px-3 py-1 rounded font-bold hover:bg-green-400">
              −
            </button>

            <input type="number" value={item.quantity} min="1" onChange={e => handleQtyChange(index, e.target.value)} className="w-12 text-center font-semibold text-green-900 border border-green-300 rounded" />

            <button onClick={() => incrementQty(index)} className="bg-green-300 text-green-900 px-3 py-1 rounded font-bold hover:bg-green-400">
              +
            </button>
          </div>

          <button onClick={() => removeItem(index)} className="text-red-500 font-semibold hover:text-red-700 ml-4 mt-2 md:mt-0">
            Remove
          </button>
        </div>)}
      </div>

      <div className="mt-10 bg-green-200 p-6 rounded-xl shadow-lg text-right space-y-2">
        <p className="text-xl text-green-800 font-medium">
          Total Items: <span className="font-bold">{totalItems}</span>
        </p>
        <h3 className="text-2xl font-bold text-green-900">
          Total: ₹{totalPrice.toFixed(2)}
        </h3>
        <button className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow transition duration-300">
          Proceed to Checkout
        </button>
      </div>
    </>}
  </div>;
};
export default CartPage;
