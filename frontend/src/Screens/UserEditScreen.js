import { useReducer, useContext, useState, useEffect } from "react";
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { Store } from "../Store";
import {useNavigate, useParams} from 'react-router-dom';
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Helmet } from "react-helmet-async";





const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true};

        case 'FETCH_SUCCESS':
            return{...state, loading: false};

        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};



        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true};
                
        
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false};
        
        
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false};




        default:
            return state;
    

    }
}




export const UserEditScreen = () => {

    const [{loading, error, user, loadingUpdate}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        loadingUpdate: true,

    });
    
    
    const params = useParams();
    const {id: userId} = params;


    const {state} = useContext(Store);
    
    const {userInfo} = state;


    const navigate = useNavigate();



    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);





    const submitHandler = async (e) => {

        e.preventDefault();

        try {

            dispatch({type: 'UPDATE_REQUEST'});


            await axios.put(
                `/api/users/${userId}`,
                {
                    _id: userId,
                    name,
                    email,
                    isAdmin,
                    isSeller,

                },
                {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                }
    
            );

            dispatch({type: 'UPDATE_SUCCESS'});

            navigate('/admin/users');

        }


        catch(err) {

            dispatch({type: 'UPDATE_FAIL'});

            console.log(err);
        }

    };


    
    
    useEffect(() => {
    
        const fetchData = async () => {
    
            try {
    
                dispatch({type: 'FETCH_REQUEST'});
    
                const {data} = await axios.get(`/api/users/${userId}`, {

                    headers: {authorization: `Bearer ${userInfo.token}`}

                });
                

                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                setIsSeller(data.isSeller);
    

                dispatch({type: 'FETCH_SUCCESS'});
    
    
            }
    
            catch (err) {

                console.log(err);
                dispatch({type: 'FETCH_FAIL', payload: err});

            }
    
        }
    
        fetchData();
    

    }, [userId, userInfo]);







    return (
        <div className="userEditScreen">

            <Helmet>
                Edit User
            </Helmet>


            <div>
                Edit User
            </div>

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

                        <input type="text" placeholder="Name" value={name}
                        onChange = {(event) => {
                            setName(event.target.value);
                        }}/>

                        <input type="text" placeholder="Email" value={email}
                        onChange = {(event) => {
                            setEmail(event.target.value);
                        }}/>


                        <input type="checkbox" name="isSeller" checked={isSeller} label='isSeller'
                        onChange = {(event) => {
                            setIsSeller(event.target.checked);
                        }}/>

                        <label for="isSeller">Is Seller</label>




                        <input type="checkbox" name="isAdmin" checked={isAdmin} label='isAdmin'
                        onChange = {(event) => {
                            setIsAdmin(event.target.checked);
                        }}/>

                        <label for="isAdmin">Is Admin</label>


                        <div>
                            <Button type='submit' onClick={submitHandler}>Update</Button>
                        </div>

   

                    </div>
                )
            }

        </div>
    )
}