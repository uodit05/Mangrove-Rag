// Navbar.js

import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import {Link} from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg font-semibold"><Link to="/">Mangrove</Link></span>
          <button
            className="md:hidden ml-2 text-white focus:outline-none"
            onClick={toggleNavbar}
          >
            <FaBars />
          </button>
        </div>
        <div
          className={`${
            isOpen ? '' : 'hidden'
          } md:flex md:items-center md:space-x-4`}
        >
          <Link to="chatpage"><button className="hidden md:inline-block">Chat with us!</button></Link>
          <Link to="recommended"><button className="hidden md:inline-block">Recommended for you</button></Link>
          <Dropdown title="Shop by Category">
            <DropdownItem link="#">Electronics</DropdownItem>
            <DropdownItem link="#">Clothing</DropdownItem>
            <DropdownItem link="#">Books</DropdownItem>
            {/* Add more categories */}
          </Dropdown>
          <Dropdown title="Your Account">
            <DropdownItem link="#">Orders</DropdownItem>
            <DropdownItem link="#">Your Wishlist</DropdownItem>
            <DropdownItem link="#">Account</DropdownItem>
          </Dropdown>
          {/* Add more dropdowns */}
          <button className="hidden md:inline-block">Sign In</button>
          <button className="hidden md:inline-block bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-md">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className="relative z-10">
        <button
          className="hover:text-yellow-500 focus:outline-none"
          onClick={toggleDropdown}
        >
          {title}
        </button>
        <div
          className={`${
            isOpen ? '' : 'hidden'
          } absolute top-full left-0 bg-white w-56 rounded-md shadow-md mt-2 z-10`}
        >
          {children}
        </div>
      </div>
    );
  };
  

const DropdownItem = ({ link, children }) => {
  return (
    <a
      href={link}
      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
    >
      {children}
    </a>
  );
};

export default Navbar;
