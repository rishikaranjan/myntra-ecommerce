import {useContext} from 'react';
import {Store} from '../Store';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



export const WishlistScreen = () => {

    const navigate = useNavigate();

    const {state, dispatch: ctxDispatch} = useContext(Store);

    const { cart, wishlist } = state;



    const addToCartHandler = async (prop) => {

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



    const removeFromWishlistHandler = (prop) => {

        ctxDispatch({
            type: 'REMOVE_FROM_WISHLIST',
            payload: prop,
        })

    }

    

    return (

        <div className="wishlistScreen">

            <Helmet>
                <title>Wishlist</title>
            </Helmet>

            <div className="heading">Wishlist</div>

            {
                wishlist.map((item) => {
                    return (
                        <div className='wishlistScreen__items'>
                            <img src = {item.image} alt = {item.name}/>
                            <div>{item.name}</div>
                            <div>{item.price}</div>

                            <button onClick={() => {
                                addToCartHandler(item);
                            }}>ADD TO CART</button>

                            <button onClick={() => {
                                removeFromWishlistHandler(item);
                            }}>REMOVE</button>


                        </div>
                    )
                })
            }

        </div>
    )

}