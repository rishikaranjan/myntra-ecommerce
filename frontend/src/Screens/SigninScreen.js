import { Helmet } from "react-helmet-async"
import { useState, useContext, useEffect } from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import axios from 'axios';
import {Store} from '../Store';



export const SigninScreen = () => {

    const navigate = useNavigate();

    const {search} = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectInUrl ? redirectInUrl : '/';


    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;



    const signinHandler = async (e) => {

        e.preventDefault();

        try 
        {

          const { data } = await axios.post('/api/users/signin', 
          {
            email,
            password,

          });

          ctxDispatch({type: 'USER_SIGNIN', payload: data});

          localStorage.setItem('userInfo', JSON.stringify(data));

          navigate(redirect || '/');

        } 
        
        catch (err) 
        {
            console.log(err);
        }

      };




      useEffect(() => {

        if(userInfo) {
            navigate(redirect);
        }

      }, [navigate, userInfo, redirect]);



      

    return (

        <div className="signinScreen">

            <Helmet> Sign In </Helmet>

            <input type="text" placeholder="Email" 
            onChange = {(event) => {
                setEmail(event.target.value);
            }}/>


            <input type="password" placeholder="Password"
            onChange = {(event) => {
                setPassword(event.target.value);
            }}/>

            <button onClick={signinHandler}>Sign In</button>

            <div>New customer?{' '}
            <Link to= {`/signup?redirect=${redirect}`}>Create your account</Link></div>


        </div>
    )
}