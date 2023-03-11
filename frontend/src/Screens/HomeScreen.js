import { ProductItem } from "../Components/Products/ProductItem";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import logger from 'use-reducer-logger';
import { Helmet } from "react-helmet-async";
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { Navbar } from "../Components/Navbar/Navbar";
import '../ScreensCSS/HomeScreen.css';


const reducer = (state, action) => {

    switch(action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        
        case 'FETCH_SUCCESS':
            return {...state, products : action.payload, loading: false};

        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        default:
            return state;
    }
};



export const HomeScreen = () => {


    const [{loading, products, error}, dispatch] = useReducer(logger(reducer), {
        loading: true,
        error: '',
        products: []
    });



    useEffect(() => {

        const fetchData = async () => {

            dispatch({type: 'FETCH_REQUEST'});

            try {

                const result = await axios.get('/api/products'); 
                dispatch({type: 'FETCH_SUCCESS', payload: result.data});

            }

            catch (err) {

                dispatch({type: 'FETCH_FAIL', payload: err.message});

            }

        }


        fetchData();

    }, []);



    

    return (
        <div className="products">

            <Helmet>
                <title>Amazon</title>
            </Helmet>


            <div className="products__productItems">
    
                {

                    loading ? (
                        <LoadingBox/>
                    ) : 

                    error? (
                        <div> {error} </div>
                    ) : 

                    (
                        <div className="products__displayProducts">
                            {
                                products.map((item) => {
                                    return(
                                    <ProductItem
                                    key = {item.slug}
                                    prop = {item}
                                    />
                                    )   
                                })

                            }
                        
                        </div>

                    )
                    
                }
            

            </div>
        </div>
    )
}


