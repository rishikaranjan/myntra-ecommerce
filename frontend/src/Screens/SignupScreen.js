import { Helmet } from "react-helmet-async"
import { useState, useContext, useEffect } from "react";
import {useLocation, useNavigate, Link} from "react-router-dom";
import axios from 'axios';
import {Store} from '../Store';



export const SignupScreen = () => {

    const navigate = useNavigate();

    const {search} = useLocation();

    const redirectInUrl = new URLSearchParams(search).get('redirect');

    const redirect = redirectInUrl ? redirectInUrl : '/';


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;



    const signupHandler = async (e) => {

        e.preventDefault();

        if(password !== confirmPassword) {
          alert('Password does not match'); 
          return;
        }

        try 
        {

          const { data } = await axios.post('/api/users/signup', 
          {
            name,
            email,
            password,

          });

          console.log(data);

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

        <div className="signupScreen">

            <Helmet> Sign Up </Helmet>

            <input type="text" placeholder="Name" 
            onChange = {(event) => {
                setName(event.target.value);
            }}/>

            <input type="email" placeholder="Email" 
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


            <button onClick={signupHandler}>Sign Up</button>


            <div>Have an account?{' '}
            <Link to= {`/signin?redirect=${redirect}`}>Login to your account</Link></div>


        </div>
    )
}