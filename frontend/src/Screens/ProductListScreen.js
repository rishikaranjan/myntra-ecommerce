import { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../ScreensCSS/ProductListScreen.css';
import {Helmet} from 'react-helmet-async';
import '../App.css';



const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true};
        

        case 'FETCH_SUCCESS':
            return {
                ...state, 
                products : action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages, 
                loading: false
            };


        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};


        case 'CREATE_REQUEST':
            return {...state, createLoading: true};


        case 'CREATE_SUCCESS':
            return {...state, createLoading: false};


        case 'CREATE_FAIL':
            return {...state, createLoading: false};



        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true, successDelete: false};
    
    
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true};
    
    
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false, successDelete: false};

        
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };


        default:
            return state;
    }
};





export const ProductListScreen = () => {

    const [{loading, error, products, pages, createLoading, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        
    });

    const navigate = useNavigate();

    
    const {search, pathname} = useLocation();

    const sp = new URLSearchParams(search);

    const page = sp.get('page') || 1;



    const {state} = useContext(Store);

    const {userInfo} = state;




    const createHandler = async () => {

        try {

            dispatch({type: 'CREATE_REQUEST'});

            const {data} = await axios.post(
                '/api/products',
                {
                    headers: {authorization: `Bearer ${userInfo.token}`}
                }
            );

            dispatch({type: 'CREATE_SUCCESS'});

            navigate(`/admin/product/${data.product._id}`);

        }

        catch(err) {

            dispatch({type: 'CREATE_FAIL', payload: err});

            console.log(err);
        }

    };




    const deleteHandler = async (product) => {

        try {

            dispatch({type: 'DELETE_REQUEST'});

            const {data} = await axios.delete(`/api/products/${product._id}`,
                {
                    headers: {authorization: `Bearer ${userInfo.token}`}
                }
            );

            dispatch({type: 'DELETE_SUCCESS'});

        }

        catch(err) {

            dispatch({type: 'DELETE_FAIL'});

            console.log(err);
        }

    };




    useEffect(() => {

        const fetchData = async () => {

            try {

                dispatch({type: 'FETCH_REQUEST'});


                const {data} = await axios.get(`/api/products/admin?page=${page}`, {

                    headers: {authorization: `Bearer ${userInfo.token}`}

                }); 

                dispatch({type: 'FETCH_SUCCESS', payload: data});

            }

            catch (err) {

                dispatch({type: 'FETCH_FAIL', payload: err});

                console.log(err);
            }

        };


        if (successDelete) {

            dispatch({ type: 'DELETE_RESET' });

        } 
          
          else {
            fetchData();
          }


    }, [page, userInfo, successDelete]);





    return (
        <div className="productListScreen">

            <Helmet>
                <title>Product List</title>
            </Helmet>

            <div className="heading">Product List</div>

            <button className="button__success btnCreate" onClick={createHandler}>Create</button>


            {
                createLoading && <LoadingBox/>
            }

            {
                loadingDelete && <LoadingBox/>
            }

            {
                loading ? 
                (
                    <LoadingBox/>
                ) : 
                
                error ? 
                (
                    <div>{error}</div>
                ) : 

                (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>ACTIONS</th>
                                    
                                </tr>
                            </thead>

                            <tbody  className='productListScreen__table'>
                                {
                                    products.map((product) => (

                                        <tr>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td><img className="productListScreen__table__image" src = {product.image} /></td>
                                            <td>{product.price}</td>
                                            <td>{product.category}</td>
                                            <td className="action__btn">
                                                <button className="button__white"
                                                onClick={() => navigate(`/admin/products/${product._id}`)}
                                                >Edit</button>

                                                <button className="button__white"
                                                onClick={() => {deleteHandler(product)}}
                                                >Delete</button>


                                            </td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>


                        <div>

                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                    key={x + 1}
                                    to={`/admin/products?page=${x + 1}`}
                                    >
                                        {x + 1}
                                </Link>
                                ))}

                        </div>

                    </div>

                )
            }

        </div>
    )
}