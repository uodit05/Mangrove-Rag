import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import Chatpage from './pages/Chatpage';
import Recommended from './pages/Recommended';

const App = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar />
        </div>
        <Routes>
          {/* <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} /> */}
          <Route exact path="/" element={<Homepage />} />
          <Route path="/chatpage" element={<Chatpage />} />
          <Route path="/recommended" element={<Recommended />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

