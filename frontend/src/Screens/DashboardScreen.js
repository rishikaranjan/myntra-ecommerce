import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import axios from "axios";
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Chart from 'react-google-charts';
import '../ScreensCSS/DashboardScreen.css';
import '../App.css';



const reducer = (state, action) => {

    switch(action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        
        case 'FETCH_SUCCESS':
            return {...state, summary : action.payload, loading: false};

        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        default:
            return state;
    }
};



export const DashboardScreen = () => {



    const [{loading, summary, error}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });



    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;


    useEffect(() => {

        const fetchData = async () => {

            dispatch({type: 'FETCH_REQUEST'});

            try {

                const {data} = await axios.get('/api/orders/summary',

                    {
                        headers: {authorization: `Bearer ${userInfo.token}`}
                    }

                
                );

                dispatch({type: 'FETCH_SUCCESS', payload: data});

            }

            catch (err) {

                dispatch({type: 'FETCH_FAIL', payload: err});
                console.log(err);
            }

        };

        fetchData();

    }, [userInfo]);




    return (
        <div className="dashboardScreen">


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
                    <>

                        <div className="heading title">Dashboard</div> 

                        <div className="dashboardScreen__row">

                            <div className="dashboardScreen__col">
                                <h4>Users</h4>
                                {
                                    summary.users && summary.users[0] ? summary.users[0].numUsers : 0
                                }
                            </div>

                            <div className="dashboardScreen__col">
                                <h4>Orders</h4>
                                {
                                    summary.orders && summary.users[0] ? summary.orders[0].numOrders : 0
                                }
                            </div>

                            <div className="dashboardScreen__col">
                                <h4>Total Sales</h4>

                                ₹
                                {
                                    summary.orders && summary.users[0] ? summary.orders[0].totalSales.toFixed(2) : 0
                                }
                            </div>

                        </div>

                        


                        <div className="my-3">
                            <div className="subtitle">Sales</div>
                            {
                                summary.dailyOrders.length === 0 ? 
                                (
                                    <div>No Sales</div>
                                ) : 

                                (
                                    <Chart 
                                    width = "100%"
                                    height="400px"
                                    chartType="AreaChart"
                                    loader={<div>Loading Chart...</div>}
                                    data={[
                                        ['Date', 'Sales'],
                                        ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                                    ]}
                                    ></Chart>
                                )
                            }
                        </div>


                        <div className="my-3">
                            <div className="subtitle">Categories</div>
                            {
                                summary.productCategories.length === 0 ? 

                                (
                                    <div>No Category</div>
                                ) : 

                                (
                                    <Chart
                                        width="100%"
                                        height="400px"
                                        chartType="PieChart"
                                        loader={<div>Loading Chart...</div>}
                                        data={[
                                            ['Category', 'Products'],
                                            ...summary.productCategories.map((x) => [x._id, x.count]),
                                        ]}
                                    ></Chart>
                                )
                            }
                        </div>

                    </>
                )
            }

            
            

        </div>
    )
}