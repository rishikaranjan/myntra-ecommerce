import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useReducer, useState, useContext } from "react";
import '../ScreensCSS/ProfileScreen.css';



const reducer = (state, action) => {

    switch (action.type) {

        case 'FETCH_REQUEST':
            return { ...state, loadingUpdate: true };
        
        case 'FETCH_SUCCESS':
            return { ...state, loadingUpdate: false };

        case 'FETCH_FAIL':
            return { ...state, loadingUpdate: false };
    
        default:
            return state;
    }
};




export const ProfileScreen = () => {

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [sellerName, setSellerName] = useState(userInfo.sellerName);
    const [sellerLogo, setSellerLogo] = useState(userInfo.sellerLogo);
    const [sellerDescription, setSellerDescription] = useState(userInfo.sellerDescription);




    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {

        loadingUpdate: false,

    });





    const updateHandler = async (e) => {

        e.preventDefault();

        dispatch({type: 'FETCH_REQUEST'});

            try {

                const {data} = await axios.put(
                    '/api/users/profile',

                    {
                        name,
                        email,
                        password,
                        sellerName,
                        sellerLogo,
                        sellerDescription,
                    },

                    {
                        headers: { authorization : `Bearer ${userInfo.token}` },
                    }

                );

                dispatch({type: 'FETCH_SUCCESS'});

                ctxDispatch({type: 'USER_SIGNIN', payload: data});

                localStorage.setItem('userInfo', JSON.stringify(data));

            }

            catch (err) {

                dispatch({type: 'FETCH_FAIL'});
                console.log(err);
                
            }
        

        
    }




    return (
        <div className='profileScreen'>

            <Helmet>
                <title>Profile</title>
            </Helmet>


            <h1>Profile</h1>


            <input type="text" placeholder="Name" 
            onChange = {(event) => {
                setName(event.target.value);
            }}/>


            <input type="text" placeholder="Email" 
            onChange = {(event) => {
                setEmail(event.target.value);
            }}/>


            <input type="password" placeholder="Password"
            onChange = {(event) => {
                setPassword(event.target.value);
            }}/>

            <input type="password" placeholder="Confirm Password"
            onChange = {(event) => {
                setConfirmPassword(event.target.value);
            }}/>



            {/* {
                userInfo.isSeller && (

                    <div>

                        <div>Seller</div>


                        <input type="text" placeholder="Seller Name"
                        onChange = {(event) => {
                            setSellerName(event.target.value);
                        }}/>


                        <input type="text" placeholder="Logo"
                        onChange = {(event) => {
                            setSellerLogo(event.target.value);
                        }}/>


                        <input type="text" placeholder="Description"
                        onChange = {(event) => {
                            setSellerDescription(event.target.value);
                        }}/>




                    </div>
                )
            } */}


            <button onClick={updateHandler}>Update Profile</button>

        </div>
    )
}