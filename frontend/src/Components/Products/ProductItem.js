import { Link } from "react-router-dom";
import "./ProductItem.css";
import {useContext} from 'react';
import {Store} from '../../Store';
import {Helmet} from 'react-helmet-async';
import axios from 'axios';



export const ProductItem = ({prop}) => {

    const {state, dispatch: ctxDispatch} = useContext(Store);

    const {
        cart: {cartItems},
    } = state;

    

    // const addToCartHandler = async (prop) => {

    //     const existItem = cartItems.find((x) => x._id ===  prop._id);

    //     const quantity = existItem ? existItem.quantity + 1 : 1;

    //     const {data} = await axios.get(`/api/products/${prop._id}`);

    //     if(data.countInStock < quantity) {
    //         window.alert('Product is out of stock');
    //         return;
    //     } 

        
    //     ctxDispatch({
    //         type: 'ADD_TO_CART',
    //         payload: {...prop, quantity},
    //     })

    // }



    return (
        <div className="productItem">
            
            <Link to={`/product/${prop.slug}`}>

                <img className="productItem__productImage" src= {prop.image}
                alt = "productImage"/>

            </Link>

            
        

            <div className="productOthers">
                <div className="productTitle">{prop.name}</div>
                <div className="productDesc">{prop.description}</div>
                <div className="productPrice">Rs. <span>{prop.price}</span></div>

            </div>

            
        </div>
    )
}

