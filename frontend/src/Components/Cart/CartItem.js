import './CartItem.css';
import {useContext} from 'react';
import {Store} from '../../Store';
import {Helmet} from 'react-helmet-async';
import axios from 'axios';

import Button from 'react-bootstrap/Button';


export const CartItem = ({prop}) => {

    const {state, dispatch: ctxDispatch} = useContext(Store);

    const {
        cart: {cartItems},
    } = state;

    

    const updateCartHandler = async (prop, quantity) => {

        const {data} = await axios.get(`/api/products/${prop._id}`);

        if(data.countInStock < quantity) {
            window.alert('Product is out of stock');
            return;
        } 

        
        ctxDispatch({
            type: 'ADD_TO_CART',
            payload: {...prop, quantity},
        })

    }




    const removeFromCartHandler = (prop) => {

        ctxDispatch({
            type: 'REMOVE_FROM_CART',
            payload: prop,
        })

    }



    const addToWishlistHandler = async (prop) => {

       
        const {data} = await axios.get(`/api/products/${prop._id}`);

        ctxDispatch ({
            type:'ADD_TO_WISHLIST',
            payload: { ...prop }
        });


    }




    return (
        <div className="cartItem">

            <img className="cartItem__cartProductImage" src={prop.image}
            alt = "cartProductImage" />

            <div className="cartItem__cartProductDetails">
                <div className="cartItem__cartProductTitle" >{prop.name}</div>
                <div className="cartItem__cartProductDesc" >{prop.description}</div>
                <div className="cartItem__cartProductSize" >Size</div>

                <div className='cartItem__cartProductQuantity'>

                    <button onClick={() => {
                        updateCartHandler(prop, prop.quantity - 1);
                    }}>-</button>

                    <div className="cartItem__cartProductQty">{prop.quantity}</div>

                    <button onClick={() => {
                        updateCartHandler(prop, prop.quantity + 1);
                    }}>+</button>

                </div>

           


                <div className="cartItem__cartProductPrice">Rs. <span>{prop.price}</span></div>
                
                <div className='cartItem__cartProduct__btns'>

    
                    <div className='cartItem__cartProductBtn' 
                    onClick={() => {
                        removeFromCartHandler(prop);
                    }}>Delete</div>

                    <div> | </div>

                    <div className='cartItem__cartProductBtn'
                    onClick={() => {
                        addToWishlistHandler(prop);
                        removeFromCartHandler(prop);
                    }} >Save Fom Later</div>

                </div>
              
               

            </div>

        </div>
    )
}