import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import { HomeScreen } from './Screens/HomeScreen';
import { ProductScreen } from "./Screens/ProductScreen";
import { CartScreen } from "./Screens/CartScreen";
import { SigninScreen } from "./Screens/SigninScreen";
import { SignupScreen } from "./Screens/SignupScreen";
import { ProfileScreen } from "./Screens/ProfileScreen";
import { ShippingAddressScreen } from "./Screens/ShippingAddressScreen";
import { PaymentMethodScreen } from "./Screens/PaymentMethodScreen";
import {PlaceOrderScreen} from './Screens/PlaceOrderScreen';
import {OrderScreen} from './Screens/OrderScreen';
import {OrderHistoryScreen} from './Screens/OrderHistoryScreen';
import {ProtectedRoute} from './Components/Admin/ProtectedRoute';




import { useContext } from 'react';
import { Store } from './Store';
import { Link } from "react-router-dom";



import { DashboardScreen } from "./Screens/DashboardScreen";


import { AdminRoute } from "./Components/Admin/AdminRoute";
import { SellerRoute } from "./Components/Seller/SellerRoute";


import { ProductListScreen } from "./Screens/ProductListScreen";
import { ProductEditScreen } from "./Screens/ProductEditScreen";
import { OrderListScreen } from "./Screens/OrderListScreen";
import { UserListScreen } from "./Screens/UserListScreen";
import { UserEditScreen } from "./Screens/UserEditScreen";
import { Navbar } from "./Components/Navbar/Navbar";
import { WishlistScreen } from "./Screens/WishlistScreen";
import { SearchScreen } from "./Screens/SearchScreen";



function App() {

  const {state, dispatch: ctxDispatch} = useContext(Store);
  const {cart, userInfo} = state;


  


  return (
    <div className="app">

    <Router>

      <Navbar/>
     


        <Routes>

          {/* Admin Routes */}

          <Route path = "/admin/dashboard" element= {
            <AdminRoute>
              <DashboardScreen/>
            </AdminRoute>
          }/>


          <Route path = "/admin/products" element= {
            <AdminRoute>
              <ProductListScreen/>
            </AdminRoute>
          }/>


          <Route path = "/admin/products/:id" element= {
            <AdminRoute>
              <ProductEditScreen/>
            </AdminRoute>
          }/>


          <Route path = "/admin/orders" element= {
            <AdminRoute>
              <OrderListScreen/>
            </AdminRoute>
          }/>

          

          <Route path = "/admin/users" element= {
            <AdminRoute>
              <UserListScreen/>
            </AdminRoute>
          }/>



          <Route path = "/admin/users/:id" element= {
            <AdminRoute>
              <UserEditScreen/>
            </AdminRoute>
          }/>






          {/* User Routes */}


          <Route path = "/" element= {<HomeScreen/>}/>

          <Route path = "/product/:slug" element= {<ProductScreen/>}/>

          <Route path = "/cart" element= {<CartScreen/>}/>

          <Route path = "/signin" element= {<SigninScreen/>}/>

          <Route path = "/signup" element= {<SignupScreen/>}/>

          <Route path = '/search/:search' element = {<SearchScreen/>}/>

          <Route path = "/profile" element= {
            <ProtectedRoute>
              <ProfileScreen/>
            </ProtectedRoute>
          }/>

          <Route path = "/shipping" element= {<ShippingAddressScreen/>}/>

          <Route path = "/payment" element= {<PaymentMethodScreen/>}/>

          <Route path = "/placeorder" element= {<PlaceOrderScreen/>}/>

          <Route path = "/order/:id" element= {
            <ProtectedRoute>
              <OrderScreen/>
            </ProtectedRoute>
          }/>

          <Route path = "/orderhistory" element = {
            <ProtectedRoute>
              <OrderHistoryScreen/>
            </ProtectedRoute>
          }/>


          <Route path = "/wishlist" element = {
            <ProtectedRoute>
              <WishlistScreen/>
            </ProtectedRoute>
          }/>

         


        </Routes>
      </Router>
      
     
    </div>
  );
}

export default App;
