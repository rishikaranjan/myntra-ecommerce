import { Helmet } from "react-helmet-async"
import { useState, useContext, useEffect, useReducer } from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import axios from 'axios';
import {Store} from '../Store';
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";

import '../ScreensCSS/PlaceOrderScreen.css';


const reducer = (state, action) => {

    switch(action.type) {

        case 'CREATE_REQUEST':
            return {...state, loading: true};

        case 'CREATE_SUCCESS':
            return {...state, loading: false};
        
        case 'CREATE_FAIL':
            return {...state, loading: false};

        default:
            return state;


    }
};



export const PlaceOrderScreen = () => {
    
    const navigate = useNavigate();


    const [{ loading }, dispatch] = useReducer(reducer,{
        loading: false,


    });


    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { cart, userInfo } = state;



    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    

    cart.itemsPrice = round2(cart.cartItems.reduce((a,c) => 
        a + c.quantity * c.price, 0
    ));


    cart.shippingPrice = cart.itemsPrice > 499 ? round2(0) : round2(50);

    cart.taxPrice = round2(cart.itemsPrice * 0.15);

    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;





    const placeOrderHandler = async () => {

        try {

          dispatch({ type: 'CREATE_REQUEST' });

          const { data } = await axios.post('/api/orders',

            {
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: cart.paymentMethod,
              itemsPrice: cart.itemsPrice,
              shippingPrice: cart.shippingPrice,
              taxPrice: cart.taxPrice,
              totalPrice: cart.totalPrice,
            },

            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }

          );


          ctxDispatch({type: 'CART_CLEAR'});

          dispatch({type: 'CREATE_SUCCESS'});
          
          localStorage.removeItem('cartItems');

          navigate(`/order/${data.order._id}`);

        } 
        
        catch (err) {
            
          dispatch({ type: 'CREATE_FAIL' });

          console.log(err);
        }
      };



    useEffect(() => {

        if (!cart.paymentMethod) {
          navigate('/payment');
        }

      }, [cart, navigate]);



    return (

        <div className='placeOrderScreen'>

          <Helmet>
            <title>Review Products</title>
          </Helmet>

            


            <div className="placeOrderScreen__left">

            <h1>Review Products</h1>

              <h3>Cart Items</h3>

              <div className="placeOrderScreen__cartItems">

                {
                    cart.cartItems.map((prop) => {
                        return (
                            <div className="placeOrderScreen__cartItems__details">

                                <Link to ={`/product/${prop.slug}`}>

                                    <img className="placeOrderScreen__cartItems__image" src={prop.image} alt = "cartProductImage" />
                                    
                                </Link>
                                    
                                    <div className="placeOrderScreen__cartItems__info">

                                      <div className="cartItem__cartProductTitle" >{prop.name}</div>
                                      <div className="cartItem__cartProductDesc" >{prop.description}</div>
                                      <div className="cartItem__cartProductQty">Qty: {prop.quantity}</div>
                                      <div className="cartItem__cartProductPrice">Rs. <span>{prop.price}</span></div>

                                    </div>
                                    


                            </div>
                        )
                    })
                }

              </div>

            </div>







            <div className="placeOrderScreen__right">

              <div className="placeOrderScreen__right__shippingAddress">

                <h3>Shipping address</h3>

                <div>Name: {cart.shippingAddress.name}</div>
                <div>Address: {cart.shippingAddress.address}</div>
                <div>Postal Code: {cart.shippingAddress.postalCode}</div>

                <Link to ='/shipping'>Edit Shipping Address</Link>

              </div>


              <div className="placeOrderScreen__right__paymentMethod">

                <h3>Payment Method</h3>
                
                <div>Method: {cart.paymentMethod}</div>
                <Link to ='/payment'>Edit Payment Method</Link>

              </div>

              <div className="placeOrderScreen__right__orderSummary">

                <h3>Order Summary</h3>

                  <div>Items Price: ₹{cart.itemsPrice.toFixed(2)}</div>
                  <div>Shipping Price: ₹{cart.shippingPrice.toFixed(2)}</div>
                  <div>Tax Price: ₹{cart.taxPrice.toFixed(2)}</div>
                  <div>Total Price: ₹{cart.totalPrice.toFixed(2)}</div>

                <button onClick = {placeOrderHandler}>Place Order</button>

              </div>


            </div>


            

            {
                loading && <LoadingBox></LoadingBox>
            }


        </div>
    )
}