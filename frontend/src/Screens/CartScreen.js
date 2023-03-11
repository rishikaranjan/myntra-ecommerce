import { CartItem } from "../Components/Cart/CartItem";
import {useContext} from 'react';
import {Store} from '../Store';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import '../ScreensCSS/CartScreen.css';
import '../App.css';


export const CartScreen = () => {

    const navigate = useNavigate();

    const {state, dispatch: ctxDispatch} = useContext(Store);

    const {
        cart: {cartItems},
    } = state;



    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    }

    return (
        <div className='cartScreen'>

            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>

            

            <div className="cartScreen__left">

                {/* <div className="heading">Shopping Cart</div> */}

                <div className="cartScreen__left__subitems">

                <div className="heading">Shopping Cart</div>

                    {
                        cartItems.map((item) => {
                            return (
                                <CartItem
                                key = {item._id}
                                prop = {item}
                                />

                            )
                        })
                    }

                </div>

            </div>


            <div className="cartScreen__right">

                <div className="cartScreen__subtotal">

                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} {' '}
                    items) :
                    ₹ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}

                
                </div>

                <button className="cartScreen__checkout button__success" onClick={() => {
                checkoutHandler();
                }}>PROCEED TO BUY</button>

            </div>

            
            

        </div>
    )
}