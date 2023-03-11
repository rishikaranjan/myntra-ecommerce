import './ProductDetails.css';
import {Helmet} from 'react-helmet-async';
import { useContext } from 'react';
import { Store } from '../../Store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export const ProductDetails = ({prop}) => {


    const navigate = useNavigate();
    
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart, wishlist} = state;

    

    const addToCartHandler = async () => {

        const existItem = cart.cartItems.find((x) => x._id ===  prop._id);

        const quantity = existItem ? existItem.quantity + 1 : 1;

        const {data} = await axios.get(`/api/products/${prop._id}`);

        if(data.countInStock < quantity) {
            window.alert('Product is out of stock');
            return;
        } 

        ctxDispatch ({
            type:'ADD_TO_CART',
            payload: {...prop, quantity}
        });

        navigate('/cart');

    };



    const addToWishlistHandler = async () => {

        //const existWishlistItem = wishlist.find((x) => x._id ===  prop._id);


        const {data} = await axios.get(`/api/products/${prop._id}`);

        ctxDispatch ({
            type:'ADD_TO_WISHLIST',
            payload: { ...prop }
        });


    }



    return (

        <div className="productDetails">

            <Helmet>
                <title>{prop.name}</title>
            </Helmet>

            <div className="productDetails__currentProduct">

                <img className="productDetails__productImage" src={prop.image} 
                alt = "productDetails__productImage"/>

                <div className="productDetails__productInfo">

                    <div className="productDetails__productTitle">{prop.name}</div>
                    
                    <div className="productDetails__productDesc">{prop.description}</div>
                    <div className="productDetails__productPrice">₹ <span>{prop.price}</span></div>

                    <div>Select Size</div>

                    <div className="productDetails__btnOptions">


                        <div className='productDetails__addToCart__options'>
                        {
                            prop.countInStock > 0 && (
                                <button className="productDetails__addToCart" onClick={addToCartHandler}>ADD TO BAG</button>
                            )
                        }

                        {
                            prop.countInStock <= 0 && (
                                <button className="productDetails__addToCart">OUT OF STOCK</button>
                            )
                        }
                        </div>

                        
                        <button className="productDetails__addToWishlist" onClick={addToWishlistHandler}>WISHLIST</button>
                   
                    </div>


                </div>

                    

                

            </div>
        
        </div>

       
    )

}