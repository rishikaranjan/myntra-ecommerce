import { Helmet } from "react-helmet-async";
import { useEffect, useReducer, useState, useContext } from "react";
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../App.css';



const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true};
        
        case 'FETCH_SUCCESS':
            return {...state, orders: action.payload, loading: false};

        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        default:
            return state;
    }
    
};



export const OrderHistoryScreen = () => {

    const {state} = useContext(Store);
    const {userInfo} = state;

    const navigate = useNavigate();


    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: {},
        error: '',

    });



    useEffect(() => {

        const fetchData = async () => {

            dispatch({type: 'FETCH_REQUEST'});

            try {

                const { data } = await axios.get(
                    `/api/orders/mine`,

                    {
                        headers: { authorization : `Bearer ${userInfo.token}` }
                    }
                );

                dispatch({type: 'FETCH_SUCCESS', payload: data});

                console.log("Data", data);



            }

            catch (err) {

                dispatch({type: 'FETCH_FAIL', payload: err});
                console.log(err);

            }

        };

        fetchData();

    }, [userInfo]);



    return (

        <div className='orderHistoryScreen'>

            <Helmet>
                <title>Order History</title>
            </Helmet>

            <div className="heading">Order History</div>

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

                            <tr>
                                <th>Id</th>
                                <th>Date</th>
                                <th>Total Amt</th>
                                <th>Payment Method</th>
                                <th>Delivered</th>
                                <th>Actions</th>
                            </tr>

                            
                                {
                                    orders.map((order) => (
                                        <tr>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice.toFixed(2)}</td>
                                            <td>{order.isPaid ? order.isPaid.substring(0, 10) : 'Pay on delivery'}</td>
                                            <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                                            <td>
                                                <button className="button__white" onClick = {() => {
                                                    navigate(`/order/${order._id}`);
                                                }}>Details</button>

                                            </td>
                                        </tr>
                                    ))
                                    
                                }
                            

                        </table>
                    </div>

                )
            }

        </div>
    )
}


