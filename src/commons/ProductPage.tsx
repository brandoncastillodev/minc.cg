import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import viewCart from "../assets/market/viewCart.png"
import leftArrow from "../assets/programming/leftArrow.png";
import rightArrow from "../assets/programming/rightArrow.png";
import AddCartButton from "./AddCartButton";
import itemsTitle from "../assets/market/itemsTitle.png"
import list from "../assets/market/list.png";
import sold from "../assets/market/sold-badge.webp"

function ProductPage() {
  const API = import.meta.env.VITE_API_URL
  const {id} = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.itemData || null);
  const [images, setImages] = useState(null);
  const [pos, setPos] = useState(0)
  const [waiting, setWaiting] = useState(true);
  const [loaded, setLoaded] = useState(false)
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
    async function fetchProduct() {
      try {
        setWaiting(true);
        const [productRes, imagesRes] = await Promise.all([
          axios.get(`${API}/products/${id}`),
          axios.get(`${API}/products/images/${id}`)
        ]);
        setProduct(productRes.data);
        setImages(imagesRes.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setWaiting(false);
      }
    }

    fetchProduct();
  }, [id, refreshKey]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="content-page product-page">
      {waiting ?
        <p className='simple-text waiting-msg'>Loading, please wait...</p>
        :
        <>
        <section className={product.title == "WOMENS ACCESSORIES COLLECTION" ? "product-card margin-top-womans-collection" : "product-card"}>
          <div className="product-card__hero">
            <p className="product-card__title">{product.title}</p>
            <figure className="product-card__kart snipcart-checkout">
              <img src={viewCart} alt=""></img>
            </figure>
          </div>
          
          <div className="product-card__image">
            <figure 
            onClick={() => { setPos(pos - 1) }}
            style={pos > 0 ? { visibility: "visible" } : { visibility: "hidden" }}
            className="arrow-desktop">
              <img src={leftArrow}></img>
            </figure>
            <figure className="product-card__jpg">
              {images && images.length > 0 ? (
              <img
                loading="lazy"
                src={images[pos].replace("/upload/", "/upload/f_auto,q_auto,w_400/")}
                srcSet={`
                  ${images[pos].replace("/upload/", "/upload/f_auto,q_auto,w_400/")} 400w,
                  ${images[pos].replace("/upload/", "/upload/f_auto,q_auto,w_800/")} 800w
                `}
                sizes="(max-width: 600px) 400px, 800px"
                alt={product.title}
                onLoad={() => setLoaded(true)}
                style={{ opacity: loaded ? 1 : 0 }}
              />) : (
              <p className="simple-text">No images available</p>
              )}
              {!product.available &&<figure className="sold-badge-product-page"><img src={sold}/> </figure>}
            </figure>
            <figure 
            onClick={() => { setPos(pos + 1) }} 
            className="arrow-desktop"
            style={images && pos < images.length - 1 ? { visibility: "visible" } : { visibility: "hidden" }}  
            >     
              <img src={rightArrow}></img>
            </figure>
          </div>

          <div className="product-card__grid">
            <div className="product-card__grid-1">
              <p className="product-card__title">{product.title}</p>
            </div>
            <div className="product-card__grid-2">
              <figure className="product-card__kart snipcart-checkout">
                <img src={viewCart} alt=""></img>
              </figure>
            </div>
            <div className="product-card__grid-3">
              <p className="product-card__price">
                {product.size && `${product.size}: `}£{Math.trunc(product.price)}
              </p>
            </div>
            <div className="product-card__grid-4">
               {product.available && <AddCartButton product={product}/>}
            </div>
          </div>

          <div className="product-card__bottom">
            <figure 
              style={{ visibility: pos > 0 ? "visible" : "hidden" }} 
              onClick={() => { setPos(pos - 1) }} 
              className="arrow-mobile">
                <img src={leftArrow}></img>
            </figure>
            <div className="product-card__bottom__price">
              <p className={product.size ? 'product-card__price': "product-card__price no-size" }>
                <span>{product.size && (product.size =="Raffle Tickets" ? "Tickets: " : `${product.size}:`)}</span>
                <span>£{Math.trunc(product.price)}</span></p>
              <figure className="add-to-cart-btn">
                {product.available && <AddCartButton product={product}/>}
              </figure>
            </div>
            <figure 
              style={{ visibility: images && pos < images.length - 1 ? "visible" : "hidden" }} 
              onClick={() => { setPos(pos + 1) }} 
              className="arrow-mobile">
                <img src={rightArrow}></img>
            </figure>
          </div>

          {product.title === "WOMENS ACCESSORIES COLLECTION" && (
            isMobile ?
            (<div className="raffle-info">
              <figure className="raffle-info__title">
                <img src={itemsTitle} alt="raffle-info-title" />
              </figure>
              <figure className="raffle-info__list">
                <img src={list} alt="raffle-info-list" />
              </figure>
              <div className={isMobile ?"product-advice-note":"product-advice-note-desktop"}>
                <h3>PLEASE NOTE:</h3>
                <br/>
                <p>Although piercings have been cleaned before shipping,</p>
                <p>we advise customers to carry out their own cleaniing procedure</p>
                <p>upon receiving their purchase.</p>
              </div>
            </div> ):

            (<div className="raffle-info-desktop">
              <figure className="raffle-info__title-desktop">
                <img src={itemsTitle} alt="raffle-info-title" />
              </figure>
              <div className="raffle-info-desktop-subdivision">
                <figure className="raffle-info__list-desktop">
                  <img src={list} alt="raffle-info-list" />
                </figure>
                <div className={isMobile ?"product-advice-note":"product-advice-note-desktop"}>
                  <h3>PLEASE NOTE:</h3>
                  <br/>
                  <p>Although piercings have been cleaned before shipping,</p>
                  <p>we advise customers to carry out their own cleaniing procedure</p>
                  <p>upon receiving their purchase.</p>
                </div>
              </div>
            </div>)                                         
          )}
        </section>
        {product.title != "WOMENS ACCESSORIES COLLECTION" &&
          <div className={isMobile ?"product-advice-note":"product-advice-note-desktop"}>
            <h3>PLEASE NOTE:</h3>
            <br/>
            <p>Although piercings have been cleaned before shipping,</p>
            <p>we advise customers to carry out their own cleaniing procedure</p>
            <p>upon receiving their purchase.</p>
          </div>
        }
      </>
    }
    </main>
  )
}

export default ProductPage;