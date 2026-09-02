import { useEffect, useState } from 'react'
import ItemCard from '../commons/ItemCard.jsx'
import marketTitle from "../assets/market/marketTitle.png"
import descriptionBox from "../assets/market/descriptBox.png"
import viewCart from "../assets/market/viewCart.png"
import axios from 'axios'

function Market(){
  const API = import.meta.env.VITE_API_URL
  const [allProducts, setAllProducts] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let unsubscribe;
    let timeout;
    const interval = setInterval(() => {
      if (window.Snipcart?.store) {
        unsubscribe = window.Snipcart.store.subscribe(() => {
          clearTimeout(timeout);
          timeout = setTimeout(() => setRefreshKey(k => k + 1), 3000);
        });
        clearInterval(interval);
      }
    }, 200);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/products`);
        setAllProducts(res.data);
        setWaiting(false)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [refreshKey]);

  return(
    <main className="content-page">
      <figure className="content-title-text">
        <img src={marketTitle} alt="market-title" />
      </figure>
      <section className="description-section">
        <figure className="description-box">
          <img src={descriptionBox} alt="market-title" />
        </figure>
        <figure className="view-cart snipcart-checkout">
          <img src={viewCart} alt="market-title" />
        </figure>
      </section>
      
      {waiting ? 
        <p className='simple-text waiting-msg'>Loading, please wait...</p>  :
      <div className='market-div'>
        <section className="market">
          {allProducts.length > 0 && allProducts.map((e, i)=>(
            <ItemCard key={i} itemData={e} />
          ))}
        </section>
      </div>
      }
    </main>
  )


}

export default Market;