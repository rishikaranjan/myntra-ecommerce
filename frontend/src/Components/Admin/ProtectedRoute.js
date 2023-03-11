import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import {Store} from '../../Store';




export const ProtectedRoute = ({children}) => {

    const {state} = useContext(Store);

    const {userInfo} = state;


    return (
        <div className='protectedRoute'>
            {
                userInfo ? children : <Navigate to ='/signin'/>
            }
        </div>
    )
}