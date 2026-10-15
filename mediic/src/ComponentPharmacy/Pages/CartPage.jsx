//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold text-green-600 mb-6">🛒 Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p className="text-lg text-gray-700">Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="grid gap-5">
//             {cartItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between"
//               >
//                 <div className="flex items-center gap-4 w-full md:w-2/3">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-24 h-24 object-cover rounded-lg border border-green-500"
//                   />
//                   <div>
//                     <h3 className="text-xl font-semibold text-green-800">
//                       {item.name}
//                     </h3>
//                     <p className="text-green-700 font-medium">₹{item.price}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-4 md:mt-0 gap-2">
//                   <button
//                     onClick={() => decrementQty(index)}
//                     className="bg-green-300 text-green-900 px-3 py-1 rounded font-bold hover:bg-green-400"
//                   >
//                     −
//                   </button>
//                   <span className="font-semibold text-green-900">
//                     {item.quantity}
//                   </span>
//                   <button
//                     onClick={() => incrementQty(index)}
//                     className="bg-green-300 text-green-900 px-3 py-1 rounded font-bold hover:bg-green-400"
//                   >
//                     +
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => removeItem(index)}
//                   className="text-red-500 font-semibold hover:text-red-700 ml-4 mt-2 md:mt-0"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//           <div className="mt-10 bg-green-200 p-6 rounded-xl shadow-lg text-right space-y-2">
//             <p className="text-xl text-green-800 font-medium">
//               Total Items: <span className="font-bold">{totalItems}</span>
//             </p>
//             <h3 className="text-2xl font-bold text-green-900">
//               Total: ₹{totalPrice.toFixed(2)}
//             </h3>
//             <button
//               onClick={() => setShowDialog(true)}
//               className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow transition duration-300"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </>
//       )}
//       {/* Checkout Dialog */}
//       {showDialog && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
//             <h3 className="text-2xl font-bold text-green-700 mb-4">
//               Enter Shipping Details
//             </h3>
//             {["address", "state", "city", "pincode", "phone"].map((field) => (
//               <input
//                 key={field}
//                 type="text"
//                 name={field}
//                 placeholder={field[0].toUpperCase() + field.slice(1)}
//                 value={form[field]}
//                 onChange={handleInputChange}
//                 className="w-full mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
//               />
//             ))}
//             <div className="mb-4">
//               <label className="font-semibold text-green-900">
//                 Payment Mode:
//               </label>
//               <div>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="paymentMode"
//                     checked
//                     readOnly
//                     className="form-radio text-green-600 mr-2"
//                   />
//                   Cash on Delivery (COD)
//                 </label>
//               </div>
//             </div>
//             <p className="mb-4 font-semibold text-green-700">
//               Total Payable: ₹{totalPrice.toFixed(2)}
//             </p>
//             <div className="flex justify-between">
//               <button
//                 onClick={handleProceedOrder}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
//               >
//                 Proceed Your Order
//               </button>
//               <button
//                 onClick={() => setShowDialog(false)}
//                 className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md font-semibold"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Confirmation Popup */}
//       {orderConfirmed && (
//         <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-black px-8 py-6 rounded-xl shadow-2xl z-50 w-[90%] max-w-xl text-center border-4 border-green-800 animate-fade-in">
//           <div className="flex items-center justify-center gap-4">
//             <svg
//               className="w-8 h-8 text-black"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//             </svg>
//             <h2 className="text-xl font-bold">Your Order is Confirmed!</h2>
//           </div>
//           <p className="mt-3 text-lg font-sm">
//             🎉 It will be delivered to your doorstep within{" "}
//             <span className="underline">2 days</span>.
//           </p>
//         </div>
//       )}
//     </div>
// export default CartPage;
//TESTING CODE:
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const CartPage = () => {
  const {
    userEmail,
    cartItems: contextCartItems
  } = useOutletContext();
  const [cartItems, setCartItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Shipping, 2 = Payment
  const [form, setForm] = useState({
    address: "",
    state: "",
    city: "",
    pincode: "",
    phone: "",
    paymentMode: "cod"
  });
  useEffect(() => {
    const safeItems = contextCartItems.map(item => ({
      ...item,
      quantity: typeof item.quantity === "number" ? item.quantity : 1
    }));
    setCartItems(safeItems);
  }, [contextCartItems]);
  const incrementQty = index => {
    const updated = [...cartItems];
    updated[index].quantity += 1;
    setCartItems(updated);
  };
  const decrementQty = index => {
    const updated = [...cartItems];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      setCartItems(updated);
    }
  };
  const removeItem = index => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const handleInputChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handlePaymentChange = mode => {
    setForm({
      ...form,
      paymentMode: mode
    });
  };
  const handleProceedOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/orders/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userEmail,
          items: cartItems,
          total: totalPrice.toFixed(2),
          address: `${form.address}, ${form.city}, ${form.state}, ${form.pincode}`,
          phone: form.phone,
          paymentMode: form.paymentMode
        })
      });
      if (response.ok) {
        setShowDialog(false);
        setOrderConfirmed(true);
        setCartItems([]);
        setCheckoutStep(1); // Reset step
        setTimeout(() => setOrderConfirmed(false), 3000);
      } else {
        alert("Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120
      }
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  const dialogVariants = {
    hidden: {
      scale: 0.95,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  const stepContent = {
    hidden: {
      x: 20,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200
      }
    },
    exit: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  return <motion.div
    initial={{
    opacity: 0
  }}
    animate={{
    opacity: 1
  }}
    transition={{
    duration: 0.4
  }}
    className="p-6 max-w-5xl mx-auto min-h-[70vh]"
  >
    <motion.h2
      className="text-3xl md:text-4xl font-bold text-teal-600 mb-8 flex items-center gap-3"
      initial={{
      x: -20
    }}
      animate={{
      x: 0
    }}
      transition={{
      type: "spring",
      stiffness: 100
    }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Your Shopping Cart
    </motion.h2>

    {cartItems.length === 0 ? <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{
      opacity: 0
    }}
      animate={{
      opacity: 1
    }}
      transition={{
      delay: 0.3
    }}
    >
      <motion.div
        className="relative mb-8"
        animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
        transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      >
        <div className="w-48 h-48 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <motion.div
          className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
          animate={{
          scale: [1, 1.1, 1]
        }}
          transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        >
          <span className="text-2xl font-bold text-red-500">?</span>
        </motion.div>
      </motion.div>
          
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Your cart feels light!</h3>
      <p className="text-gray-600 max-w-md text-center mb-8">
        Looks like you haven't added anything to your cart yet. Explore our wide range of healthcare products and find something you need.
      </p>
          
      <motion.div
        whileHover={{
        scale: 1.05
      }}
        whileTap={{
        scale: 0.95
      }}
      >
        <Link to="/home/pharmacy" className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Start Shopping
        </Link>
      </motion.div>
    </motion.div> : <>
      <motion.div className="grid gap-6" variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence>
          {cartItems.map((item, index) => <motion.div key={`${item.id}-${index}`} variants={itemVariants} exit="exit" className="bg-white p-5 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-5 w-full md:w-3/5">
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-xl border-2 border-teal-200" />
                <motion.button
                  whileHover={{
                  scale: 1.1
                }}
                  whileTap={{
                  scale: 0.9
                }}
                  onClick={() => removeItem(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-teal-600 font-bold mt-1">₹{item.price.toFixed(2)}</p>
                <p className="text-gray-500 text-sm mt-1">Each</p>
              </div>
            </div>

            <div className="flex items-center mt-4 md:mt-0 gap-4">
              <motion.button
                whileHover={{
                backgroundColor: "#0d9488"
              }}
                whileTap={{
                scale: 0.95
              }}
                onClick={() => decrementQty(index)}
                className="bg-teal-700 text-white w-9 h-9 rounded-full font-bold flex items-center justify-center"
              >
                −
              </motion.button>
              <span className="font-bold text-gray-800 text-lg w-8 text-center">
                {item.quantity}
              </span>
              <motion.button
                whileHover={{
                backgroundColor: "#0d9488"
              }}
                whileTap={{
                scale: 0.95
              }}
                onClick={() => incrementQty(index)}
                className="bg-teal-700 text-white w-9 h-9 rounded-full font-bold flex items-center justify-center"
              >
                +
              </motion.button>
            </div>

            <div className="mt-4 md:mt-0 text-right">
              <p className="text-lg font-bold text-gray-800">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm">Total</p>
            </div>
          </motion.div>)}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="mt-10 bg-gradient-to-r from-teal-500 to-cyan-600 p-6 rounded-2xl shadow-xl text-right space-y-3 backdrop-blur-sm"
        initial={{
        opacity: 0,
        y: 20
      }}
        animate={{
        opacity: 1,
        y: 0
      }}
        transition={{
        delay: 0.4
      }}
      >
        <div className="flex justify-between items-center">
          <p className="text-xl text-teal-100 font-medium">
            Total Items:
          </p>
          <span className="text-xl font-bold text-white">{totalItems}</span>
        </div>
            
        <div className="flex justify-between items-center">
          <p className="text-xl text-teal-100 font-medium">
            Subtotal:
          </p>
          <span className="text-xl text-white">₹{totalPrice.toFixed(2)}</span>
        </div>
            
        <div className="flex justify-between items-center border-t border-teal-300 pt-3 mt-2">
          <p className="text-2xl text-teal-100 font-bold">
            Order Total:
          </p>
          <h3 className="text-2xl font-bold text-white">
            ₹{totalPrice.toFixed(2)}
          </h3>
        </div>
            
        <motion.button
          whileHover={{
          scale: 1.03
        }}
          whileTap={{
          scale: 0.97
        }}
          onClick={() => setShowDialog(true)}
          className="mt-6 px-8 py-4 bg-white hover:bg-gray-100 text-teal-700 font-bold rounded-xl shadow-lg transition-all duration-300 text-lg w-full md:w-auto"
        >
          Proceed to Checkout
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </motion.div>
    </>}

    {/* Checkout Dialog - Now with steps */}
    <AnimatePresence>
      {showDialog && <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 backdrop-blur-sm"
        initial={{
        opacity: 0
      }}
        animate={{
        opacity: 1
      }}
        exit={{
        opacity: 0
      }}
      >
        <motion.div variants={dialogVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          {/* Step Indicator */}
          <div className="flex border-b border-gray-200">
            <button className={`flex-1 py-4 text-center font-medium ${checkoutStep === 1 ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500"}`} onClick={() => setCheckoutStep(1)}>
              Shipping
            </button>
            <button className={`flex-1 py-4 text-center font-medium ${checkoutStep === 2 ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500"}`} onClick={() => checkoutStep === 2 && setCheckoutStep(2)}>
              Payment
            </button>
          </div>
              
          <div className="p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-800">
                {checkoutStep === 1 ? "Shipping Details" : "Payment Method"}
              </h3>
              <motion.button
                whileHover={{
                rotate: 90
              }}
                whileTap={{
                scale: 0.9
              }}
                onClick={() => {
                setShowDialog(false);
                setCheckoutStep(1);
              }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
                
            <AnimatePresence mode="wait">
              {checkoutStep === 1 ? <motion.div key="shipping-step" variants={stepContent} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="space-y-3">
                  {["address", "city", "state", "pincode", "phone"].map(field => <div key={field}>
                    <label className="block text-gray-700 text-sm font-medium mb-1 capitalize">
                      {field}
                    </label>
                    <input type="text" name={field} placeholder={`Enter ${field}`} value={form[field]} onChange={handleInputChange} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition" />
                  </div>)}
                </div>
                      
                <div className="flex justify-between mt-6">
                  <motion.button
                    whileHover={{
                    backgroundColor: "#f3f4f6"
                  }}
                    whileTap={{
                    scale: 0.98
                  }}
                    onClick={() => setShowDialog(false)}
                    className="px-4 py-2.5 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{
                    backgroundColor: "#0d9488"
                  }}
                    whileTap={{
                    scale: 0.98
                  }}
                    onClick={() => setCheckoutStep(2)}
                    className="px-4 py-2.5 text-sm bg-teal-600 text-white font-medium rounded-lg flex items-center"
                  >
                    Continue to Payment
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div> : <motion.div key="payment-step" variants={stepContent} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-2">Choose your payment method:</p>
                        
                  {/* Payment Options - Compact Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[{
                      id: "cod",
                      label: "Cash on Delivery",
                      desc: "Pay on delivery"
                    }, {
                      id: "card",
                      label: "Credit Card",
                      desc: "Visa, Mastercard"
                    }, {
                      id: "upi",
                      label: "UPI",
                      desc: "GPay, PhonePe"
                    }, {
                      id: "netbanking",
                      label: "Net Banking",
                      desc: "Online banking"
                    }].map(method => <motion.div
                      key={method.id}
                      whileHover={{
                      scale: 1.02
                    }}
                      whileTap={{
                      scale: 0.98
                    }}
                      className={`cursor-pointer border rounded-lg p-3 transition-all ${form.paymentMode === method.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}
                      onClick={() => handlePaymentChange(method.id)}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.paymentMode === method.id ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}>
                            {form.paymentMode === method.id && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800">{method.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                        </div>
                      </div>
                    </motion.div>)}
                  </div>
                        
                  {/* Order Summary - Compact */}
                  <div className="bg-gray-50 rounded-lg p-3 mt-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium">{totalItems}</span>
                      </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-teal-700">₹{totalPrice.toFixed(2)}</span>
                      </div>
                  </div>
                </div>
                      
                <div className="flex justify-between mt-5">
                  <motion.button
                    whileHover={{
                    backgroundColor: "#f3f4f6"
                  }}
                    whileTap={{
                    scale: 0.98
                  }}
                    onClick={() => setCheckoutStep(1)}
                    className="px-4 py-2.5 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    Back
                    </motion.button>
                  <motion.button
                    whileHover={{
                    backgroundColor: "#0d9488"
                  }}
                    whileTap={{
                    scale: 0.98
                  }}
                    onClick={handleProceedOrder}
                    className="px-4 py-2.5 text-sm bg-teal-600 text-white font-medium rounded-lg flex items-center"
                  >
                      Confirm Order
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  </motion.button>
                </div>
              </motion.div>}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>

    {/* Confirmation Popup */}
    <AnimatePresence>
      {orderConfirmed && <motion.div
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-xl"
        initial={{
        y: -100,
        opacity: 0
      }}
        animate={{
        y: 0,
        opacity: 1
      }}
        exit={{
        y: -50,
        opacity: 0
      }}
        transition={{
        type: "spring",
        damping: 20
      }}
      >
        <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center border-4 border-white">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
              transition={{
              duration: 0.5,
              repeat: 1,
              repeatType: "reverse"
            }}
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
          </div>
          <motion.p
            className="mt-3 text-lg font-medium"
            initial={{
            opacity: 0
          }}
            animate={{
            opacity: 1
          }}
            transition={{
            delay: 0.3
          }}
          >
            🎉 Your order will arrive within <span className="font-bold underline">2 days</span>
          </motion.p>
          <motion.div
            className="mt-4 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
            initial={{
            width: 0
          }}
            animate={{
            width: "100%"
          }}
            transition={{
            duration: 3,
            ease: "linear"
          }}
          />
        </div>
      </motion.div>}
    </AnimatePresence>
  </motion.div>;
};
export default CartPage;
