import { useContext, useState } from 'react';
import { Store } from '../../Store';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

  
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';



export const Navbar = () => {


    const navigate = useNavigate();

    
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart, userInfo} = state;


    const [search, setSearch] = useState('');


    const searchHandler = (e) => {

        e.preventDefault();

        navigate(`/search/${search}`);

    }


    const signoutHandler = () => {

        ctxDispatch({type: 'USER_SIGNOUT'});
    
        localStorage.removeItem('userInfo');
    
        localStorage.removeItem('shippingAddress');
    
        localStorage.removeItem('paymentMethod');
    
      }


    return (
        <div className="navbar">

            <Link to ='/'>

                <div className='navbar__left'>
                    <div className='navbar__left__image'>
                        <img src = "data:image/png;base64,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"
                    alt = "myntra logo"/>
                    </div>

                    <div className="navbar__men">MEN</div>
                    <div className="navbar__women">WOMEN</div>
                    <div className="navbar__kids">KIDS</div>
                
                </div>

            </Link>



            <div className='navbar__search'>

                <div className="searchIcon"><SearchOutlinedIcon/></div>
                <input type='text' placeholder='Search' onChange={(e) => {
                    setSearch(e.target.value);
                    searchHandler();
                }}/>

            </div>



            <div className='navbar__right'>

                <div className='navbar__admin'>

                <div className='adminIcon'><AdminPanelSettingsOutlinedIcon/></div>

                    <div class="dropdown">

                        <div>Admin</div>

                        <div class="dropdown-content">
                            {
                                userInfo && userInfo.isAdmin && 
                                    (
                                        <>

                                        <Link to='/admin/dashboard'>Dashboard</Link>
                                        <Link to='/admin/products'>Products</Link>
                                        <Link to='/admin/orders'>Orders</Link>
                                        <Link to='/admin/users'>Users</Link>
                                        

                                        </>

                                    )
                            }
                            
                        </div>

                    </div>

                </div>


                <div className="navbar__profile">

                <div className='dropdown'>

                    <div className="profileIcon"><PersonOutlineOutlinedIcon/></div>

                    <div>{userInfo.name}</div> 

                    

                        <div class="dropdown-content">
                            {
                                userInfo ? 
                                (
                                <>
                                    <Link to = '/profile'>My Profile</Link>

                                    <Link to = '/orderhistory'>Order History</Link>

                                    <div onClick={signoutHandler}>Sign Out</div>

                                </>

                                ) : 

                                (
                                    <Link to='/signin'>Sign In</Link>

                                )
                            }
                            
                        </div>

                    </div>

                </div>


                

                <Link to = '/wishlist'>

                    <div className="navbar__wishlist">

                        <div className="wishlistIcon"><FavoriteBorderOutlinedIcon/></div>

                        <div>Wishlist</div>

                    </div>

                </Link>



                <Link to = '/cart'>

                    <div className="navbar__bag">

                        <div className="cartIcon"><ShoppingBagOutlinedIcon/></div>

                        <div className='navbar__cart'>

                            <div>Bag</div>

                            <div>

                                {
                                    cart.cartItems.length > 0 && (
                                        <div>{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</div>
                                    )
                                }

                            </div>

                        </div>

                    </div>

                </Link>

                


            
                
                

            </div>       

        </div>
    )
}

