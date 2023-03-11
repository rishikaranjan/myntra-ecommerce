import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import { Store } from "../Store";
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';
import '../App.css';
import '../ScreensCSS/UserListScreen.css';




const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true};

        case 'FETCH_SUCCESS':
            return{...state, loading: false, users: action.payload};

        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};



        case 'DELETE_REQUEST': 
            return {...state, loadingDelete: true, successDelete: false};

        case 'DELETE_SUCCESS': 
            return {...state, loadingDelete: false, successDelete: true};

        case 'DELETE_FAIL': 
            return {...state, loadingDelete: false, successDelete: false};

        case 'DELETE_RESET': 
            return {...state, loadingDelete: false, successDelete: false};




        default:
            return state;
    

    }

}




export const UserListScreen = () => {


    const [{loading, error, users, loadingDelete, successDelete}, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    });
    
    
    
    const {state} = useContext(Store);
    
    const {userInfo} = state;
    

    const navigate = useNavigate();



    const deleteHandler = async (user) => {

        try {

            dispatch({type: 'DELETE_REQUEST'});

            const {data} = await axios.delete(`/api/users/${user._id}`,
                {
                    headers: {authorization: `Bearer ${userInfo.token}`}
                }
            );

            dispatch({type: 'DELETE_SUCCESS'});

        }

        catch (err) {

            dispatch({type: 'DELETE_FAIL'});

            console.log(err);
        }

    }
    
    
    useEffect(() => {
    
        const fetchData = async () => {
    
            try {
    
                dispatch({type: 'FETCH_REQUEST'});
    
                const {data} = await axios.get('/api/users', {
                    headers: {authorization: `Bearer ${userInfo.token}`}
                })
    
                dispatch({type: 'FETCH_SUCCESS', payload: data});
    
    
            }
    
            catch (err) {
                console.log(err);
                dispatch({type: 'FETCH_FAIL', payload: err});
            }
    
        }

        if(successDelete) {

            dispatch({ type: 'DELETE_RESET' });

        }

        else {

            fetchData();

        }
    
        
    
    }, [userInfo, successDelete]);



   
    

    return (

        <div className="userListScreen">

            <Helmet>
                <title>User List</title>
            </Helmet>

            <div className="heading title">User List</div>

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
                                    <th>EMAIL</th>
                                    <th>NAME</th>
                                    <th>IS ADMIN</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    users.map((user) => (
                                        <tr>
                                            <td>{user._id}</td>
                                            <td>{user.email}</td>
                                            <td>{user.name}</td>
                                            <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                            <td>
                                                <button className="button__white btn" onClick={() => {
                                                    navigate(`/admin/users/${user._id}`)
                                                }}>Edit</button>


                                                <button className="button__white" onClick={() => {
                                                    deleteHandler(user);
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