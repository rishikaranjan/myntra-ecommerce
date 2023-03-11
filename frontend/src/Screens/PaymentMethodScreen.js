import { Helmet } from "react-helmet-async"
import { useState, useContext, useEffect } from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import axios from 'axios';
import {Store} from '../Store';
import '../ScreensCSS/PaymentMethodScreen.css';


export const PaymentMethodScreen = () => {

    const navigate = useNavigate();


    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart : {
        shippingAddress,
        paymentMethod
    }} = state;


    useEffect(() => {

        if(!shippingAddress.address) {
            navigate('/shipping');
        }

    }, [shippingAddress, navigate]);



    const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal');

    


    const paymentHandler = (e) => {

        e.preventDefault();

        ctxDispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName});

        localStorage.setItem('paymentMethod', paymentMethodName);

        navigate('/placeorder');

    };

    return (

        <div className='paymentMethodScreen'>

            <Helmet> Payment Method </Helmet>

            <h1>Select Payment Method</h1>

            <div>

                <label for="PayPal">PayPal</label>
                <input 
                    type="radio" 
                    id = 'PayPal'
                    value='PayPal'
                    checked = {paymentMethodName === 'PayPal'}
                    onChange = {(event) => {
                        setPaymentMethodName(event.target.value);
                }}/>

            </div>



            <div>

            <label for="Stripe">Stripe</label>
            <input
                type="radio" 
                id='Stripe'
                value='Stripe'
                checked = {paymentMethodName === 'Stripe'}
                onChange = {(event) => {
                    setPaymentMethodName(event.target.value);
            }}/>

            </div>

            

            <button onClick={paymentHandler}>Continue</button>

        </div>
    )
}