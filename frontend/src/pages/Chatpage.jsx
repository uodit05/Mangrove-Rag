import React, { useState, useEffect } from 'react';
import '../App.css'
import Product from '../components/Product';
import productData from '../assets/raw_flipkart_data_with_images.json';

// productData=JSON.parse(productData);
const Chatpage = () => {
  const [query, setQuery] = useState('');
  const [queryArray, setQueryArray] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // let hiddenquery=query+"use the pipelined csv database to suggest a product with a pid for the given query...also search the description and formatted specification along with the title to find the pid";
    //'Suggest title of '+query+' using the given data.\ Follow this approach 1:Find titles with the term '+query+' and 2:suggest in order of increasing price.'
    try {
      const response = await fetch('https://ragrecommendationsystembackend-sairamnsts-projects.vercel.app/api/query', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      // console.log(query)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setMessages([...messages, { text: query, sender: 'user' }]);
      setMessages([...messages, { text: data.result, sender: 'bot' }]);

      setQueryArray([...queryArray, query]);
      
      setQuery('');
    } catch (error) {
      console.error('Error submitting query:', error.message);
    }
  };

  // const hiddenprompt=()=>{
    
  // }
  const getPid = (json) => {
    const pids = [];
    if (JSON.parse(json).length === 0) return pids;
    JSON.parse(json).forEach((element) => {
      pids.push(element.pid);
    });
    return pids;
  };

  console.log(messages)
  console.log(query)
  console.log(queryArray)

  return (
    <div className="chat-container pt-7">
      <div className="chat-header">Mangrove LLM</div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {queryArray[index]}
            {true?
              ((JSON.parse(message.text)).map((pid) => {
                const product = productData.find((item) => item.pid === pid);
              
                if (product) {
                  return (
                    <Product 
                      key={pid}
                      name={product.title}
                      price={product.price}
                      image={product.images.split('|')} 
                    />
                  );
                } else {
                  return (
                    <div key={pid}>Product not found</div>
                  );
                }
              }))
              :
              message.text
            }
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type your query..."
          className="chat-text-input"
        />
        <button type="submit" className="chat-submit-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatpage;
