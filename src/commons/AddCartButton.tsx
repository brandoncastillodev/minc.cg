import addToCart from "../assets/market/addToCart2.png"

const API = import.meta.env.VITE_API_URL

function AddCartButton({product}){
  return(
    <figure 
      className="add-to-cart-btn buy-button snipcart-add-item"
      data-item-id={product.id}
      data-item-price={product.price}
      data-item-name={product.title}
      data-item-image={product.image}
      data-item-description={`${product?.size ?? "No Size"} | Code: ${product.sku}`}
      data-item-quantity={1}
      data-item-max-quantity="1"
      data-item-url={`${API}/products/${product.id}`}
    >             
      <img src={addToCart} alt={"add to cart button"}/>
    </figure>
  )

}

export default AddCartButton;