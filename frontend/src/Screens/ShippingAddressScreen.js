import { Helmet } from "react-helmet-async"
import {useState, useContext, useEffect} from 'react';
import {Store} from '../Store';
import {useNavigate} from "react-router-dom";
import '../ScreensCSS/ShippingAddressScreen.css';




export const ShippingAddressScreen = () => {

    const { state, dispatch: ctxDispatch } = useContext(Store);

    const {
        userInfo,
        cart: { shippingAddress },
    } = state;


    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');


  
    const navigate = useNavigate();
    
    
    


    const submitHandler = (e) => {

        e.preventDefault();

        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
            },
        });


        localStorage.setItem('shippingAddress', JSON.stringify({
            fullName,
            address,
            city,
            postalCode,
            country,

        })
        );
       

        navigate('/payment');

    };



    useEffect(() => {

        if(!userInfo) {
            navigate('/signin?redirect=/shipping');
        }

    }, [userInfo, navigate]);

    return (

        <div className='shippingAddressScreen'>

        <Helmet> Shipping Address </Helmet>


        <h1>Enter Shipping Address</h1>


        <input type="text" placeholder="Full Name" value={fullName}
            onChange = {(event) => {
                setFullName(event.target.value);
        }}/>


        <input type="text" placeholder="Address" value={address}
            onChange = {(event) => {
                setAddress(event.target.value);
        }}/>


        <input type="text" placeholder="City" value={city}
            onChange = {(event) => {
                setCity(event.target.value);
        }}/>


        <input type="text" placeholder="postalCode" value={postalCode}
            onChange = {(event) => {
                setPostalCode(event.target.value);
        }}/>

        <input type="text" placeholder="Country" value={country}
            onChange = {(event) => {
                setCountry(event.target.value);
        }}/>


        <button onClick={submitHandler}>Continue</button>


        </div>
    )
}