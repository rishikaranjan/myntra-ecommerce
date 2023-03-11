import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import {Store} from '../../Store';




export const AdminRoute = ({children}) => {

    const {state} = useContext(Store);

    const {userInfo} = state;


    return (
        <div className='adminRoute'>
            {
                userInfo && userInfo.isAdmin ? children : <Navigate to ='/signin'/>
            }
        </div>
    )
}