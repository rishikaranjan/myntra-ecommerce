import { useContext, useReducer, useEffect } from "react"
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { Store } from "../Store"
import {useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { Helmet } from "react-helmet-async";
import '../ScreensCSS/OrderListScreen.css';
import '../App.css';



const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true};
        

        case 'FETCH_SUCCESS':
            return {...state, loading: false, orders: action.payload};


        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};


        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true, successDelete: false};
            
    
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true};
    
    
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false};


        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: true};



        default:
            return state;
    }
};




export const OrderListScreen = () => {


    const navigate = useNavigate();


    const [{loading, error, orders, successDelete, loadingDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        
    });



    const {state} = useContext(Store);

    const {userInfo} = state;



    const deleteHandler = async (order) => {

        try {

            dispatch({type: 'DELETE_REQUEST'});

            const {data} = await axios.delete(
                `/api/orders/${order._id}`,
                {
                    headers : {authorization: `Bearer ${userInfo.token}`}
                }
            );

            dispatch({type: 'DELETE_SUCCESS'});

        }

        catch (err) {
            console.log(err);
            dispatch({type: 'DELETE_FAIL', payload: err});
        }

    }



    useEffect(() => {

        const fetchData = async () => {

            try {

                dispatch({type: 'FETCH_REQUEST'});

                const {data} = await axios.get('/api/orders', {
                    headers: {authorization: `Bearer ${userInfo.token}`}
                });

                dispatch({type: 'FETCH_SUCCESS', payload: data});

            }

            catch(err) {

                dispatch({type: 'FETCH_FAIL', payload: err});
                console.log(err);
            }

        };

        if(successDelete) {
            dispatch({type: 'DELETE_RESET'});
        }

        else {
            fetchData();
        }

        

    }, [userInfo, successDelete]);




    return (
        <div className="orderListScreen">

            <Helmet>
                <title>Order List</title>
            </Helmet>


            <div className="heading title">Order List</div>

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
                                    <th>ID</th>
                                    <th>USER</th>
                                    <th>DATE</th>
                                    <th>TOTAL AMT</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    orders.map((order) => (
                                        <tr>
                                            <td>{order._id}</td>
                                            <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice.toFixed(2)}</td>
                                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                                            <td>

                                                <button className="button__white btn" onClick = {() => {
                                                    navigate(`/order/${order._id}`);
                                                }}>Details</button>

                                                <button className="button__white" onClick = {() => {
                                                    deleteHandler(order);
                                                }}>Delete</button>

                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>

                        </table>

                    </div>
                )
            }

        </div>
    )

}