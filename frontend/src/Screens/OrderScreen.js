import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { useEffect, useReducer, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Button from 'react-bootstrap/Button';
import '../ScreensCSS/OrderScreen.css';




const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        
        case 'FETCH_SUCCESS':
            return {...state, order: action.payload, loading: false, error: ''};

        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};




        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };

        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };

        case 'PAY_FAIL':
            return { ...state, loadingPay: false };

        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };




        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true };
    
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true };
    
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false };

        case 'DELIVER_RESET':
            return { ...state, loadingDeliver: false, successDeliver: false };



        default:
            return state;
    }
    
};




export const OrderScreen = () => {


    const { state } = useContext(Store);

    const { userInfo } = state;


    const params = useParams();

    const { id: orderId } = params;

    const navigate = useNavigate();



    const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] =

        useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false,
        
    });

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();




    function createOrder(data, actions) {

        return actions.order

          .create({
            purchase_units: [
              {
                amount: { value: order.totalPrice },
              },
            ],
          })

          .then((orderID) => {
            return orderID;
          });
      }
    


      function onApprove(data, actions) {

        return actions.order.capture().then(async function (details) {

          try {

            dispatch({ type: 'PAY_REQUEST' });

            const { data } = await axios.put(

              `/api/orders/${order._id}/pay`,

              details,

              {
                headers: { authorization: `Bearer ${userInfo.token}` },
              }

            );

            dispatch({ type: 'PAY_SUCCESS', payload: data });

            alert('Order is paid');
           
          } 
          
          catch (err) {

            dispatch({ type: 'PAY_FAIL', payload: err });

            console.log(err);

          }

        });

      }


      function onError(err) {
        console.log(err);
      }






      const deliverOrderHandler = async () => {

        try {

            dispatch({type: 'DELIVER_REQUEST'});

            const {data} = await axios.put(
                `/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: {authorization: `Bearer ${userInfo.token}`}
                }
            );

            dispatch({type: 'DELIVER_SUCCESS', payload: data});

        }

        catch(err) {

            dispatch({type: 'DELIVER_FAIL'});
            console.log(err);

        }

      }




    useEffect(() => {

        const fetchOrder = async () => {

            try {

                dispatch({type:'FETCH_REQUEST'});

                const {data} = await axios.get(`/api/orders/${orderId}`, {

                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    },

                });

                dispatch({ type: 'FETCH_SUCCESS', payload: data });

            }

            catch (err) {

                dispatch({type:'FETCH_FAIL', payload: err});

                console.log(err);
            }
        }

        

        if(!userInfo) {
            navigate('/login');
        }

        if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {

            fetchOrder();

            if (successPay) {

                dispatch({ type: 'PAY_RESET' });

            }


            if (successDeliver) {

                dispatch({ type: 'DELIVER_RESET' });

            }
        } 
            

        else {

            const loadPaypalScript = async () => {

                const { data: clientId } = await axios.get('/api/keys/paypal', {

                  headers: { authorization: `Bearer ${userInfo.token}` },

                });

                paypalDispatch({
                  type: 'resetOptions',
                  value: {
                    'client-id': clientId,
                    currency: 'USD',
                  },
                });

                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });

            };

            loadPaypalScript();

        }


  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay, successDeliver]);
    


    return (

        <div className='orderScreen'>

            {
                loading  ? (
                    <LoadingBox/>
                ) : 
                
                error ? (
                    <div>{error}</div>
                ) : 

                (
                    <div>
                        <Helmet>
                            <title>Orders</title>
                        </Helmet>


                        <h1>Order Details</h1>

                        <div className="orderScreen__right">

                            <div>
                                Name: {order.shippingAddress.fullName} <br/>

                                Address: 
                                {order.shippingAddress.address},
                                {order.shippingAddress.city}, 
                                {order.shippingAddress.postalCode},
                                {order.shippingAddress.country} 
                                <br/>

                            </div>

                            {
                                order.isDelivered ? 

                                ( 
                                    <div>Order delivered</div>
                                ) : 

                                (
                                    <div>Order not delivered</div>
                                )
                            }


                            {
                                order.isPaid ? 

                                ( 
                                    <div>Order Paid</div>
                                ) : 

                                (
                                    <div>Order not paid</div>
                                )
                            }

                        </div>

                        <div>Items</div>

                        {
                            order.orderItems?.map((item) => (  

                                <div>
                                    <div>{item.name}</div>
                                    <img src = {item.image}/>
                                    <div>{item.quantity}</div>
                                    <div>{item.price}</div>
                                </div>
                                        
                            ))
                        }



                        <div>Order Summary</div>

                        <div>
                            Item price: ₹{Number(order.itemsPrice).toFixed(2)} <br/>
                            Shipping price: ₹{Number(order.shippingPrice).toFixed(2)} <br/>
                            Tax price: ₹{Number(order.taxPrice).toFixed(2)} <br/>
                            Total price: ₹{Number(order.totalPrice).toFixed(2)} <br/>
                        </div>


                        {

                            !order.isPaid && 
                            (

                                <div>

                                    {
                                        isPending ? 
                                        (
                                            <LoadingBox/>
                                        ) : 
                                        (
                                            <div>
                                                <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        )
                                    }


                                    {
                                        loadingPay && <LoadingBox/>
                                    }

                                </div>

                            )

                        }



                        <Button onClick={deliverOrderHandler}>Deliver Order</Button>

                        {/* {
                            userInfo.isAdmin && order.isPaid && !order.isDelivered && 
                            (
                                <div>

                                    {
                                        loadingDeliver && <LoadingBox/>
                                    }

                                    <Button onClick={deliverOrderHandler}>Deliver Order</Button>

                                </div>
                            )
                        } */}



                    </div>

                )

            }
        </div>
        
    )
}