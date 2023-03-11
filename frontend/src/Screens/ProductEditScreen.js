import { useContext, useEffect, useReducer, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store"
import { Helmet } from "react-helmet-async";
import { LoadingBox } from "../Components/LoadingBox/LoadingBox";
import Button from "react-bootstrap/Button";
import axios from "axios";





const reducer = (state, action) => {

    switch(action.type) {

        case 'FETCH_REQUEST':
            return {...state, loading: true};
        

        case 'FETCH_SUCCESS':
            return {...state, loading: false};


        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};

        

        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true};
            
    
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false};
    
    
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false};


        
        case 'UPLOAD_REQUEST':
            return {...state, loadingUpload: true, errorUpload: ''};
            
    
        case 'UPLOAD_SUCCESS':
            return {...state, loadingUpload: false, errorUpload: ''};
    
    
        case 'UPLOAD_FAIL':
            return {...state, loadingUpload: false, errorUpload: action.payload};



        default:
            return state;

    }

};




export const ProductEditScreen = () => {

    const navigate = useNavigate();

    const params = useParams();
    const {id: productId} = params;
    
    const {state} = useContext(Store);
    const {userInfo} = state;


    const [{loading, error, loadingUpdate, loadingUpload, errorUpload}, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        loadingUpdate: true,
        loadingUpload: true,
        errorUpload: '',
    });


    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');




    const updateHandler = async (e) => {

        e.preventDefault();

        try {

            dispatch({type: 'UPDATE_REQUEST'});


            await axios.put(
                `/api/products/${productId}`,
                {
                    _id: productId,
                    name,
                    slug,
                    image,
                    brand,
                    category,
                    description,
                    price,
                    countInStock,
                },
                {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                }
    
            );

            dispatch({type: 'UPDATE_SUCCESS'});

            navigate('/admin/products');

        }

        catch(err) {

            dispatch({type: 'UPDATE_FAIL'});

            console.log(err);
        }

        

    };



    const uploadFileHandler = async (e) => {

        e.preventDefault();

        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);

        try {

            dispatch({type: 'UPLOAD_REQUEST'});

            const {data} = await axios.post(
                '/api/upload',
                bodyFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${userInfo.token}`
                    }
                }
            );

            dispatch({type: 'UPLOAD_SUCCESS'});

            setImage(data.secure_url);
 
        }

        catch(err) {

            dispatch({type: 'UPLOAD_FAIL', payload: err});

            console.log(err);
        }



    };




    useEffect(() => {

        const fetchData = async () => {

            try {

                dispatch({type: 'FETCH_REQUEST'});
    
                const {data} = await axios.get(`/api/products/${productId}`);

                setName(data.name);
                setSlug(data.slug);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setDescription(data.description);
                setPrice(data.price);
                setCountInStock(data.countInStock);


    
                dispatch({type: 'FETCH_SUCCESS'});
    
            }
    
            catch(err) {
    
                dispatch({type: 'FETCH_FAIL', payload: err});
    
                console.log(err);
    
            }

        }

        fetchData();

    }, [productId]);




    return (
        <div className="productEditScreen">

            <Helmet>Edit Product</Helmet>

            <div>Edit Product</div>

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
                        <input type="text" placeholder="Name" value={name}
                        onChange = {(event) => {
                            setName(event.target.value);
                        }}/>

                        <input type="text" placeholder="Slug" value={slug}
                        onChange = {(event) => {
                            setSlug(event.target.value);
                        }}/>


                        <input type="text" placeholder="Image" value={image}
                        onChange = {(event) => {
                            setImage(event.target.value);
                        }}/>

                        <input type="file" placeholder="Image"
                        onChange = {uploadFileHandler}/>

                        <input type="text" placeholder="Brand" value={brand}
                        onChange = {(event) => {
                            setBrand(event.target.value);
                        }}/>

                        <input type="text" placeholder="Category" value={category}
                        onChange = {(event) => {
                            setCategory(event.target.value);
                        }}/>

                        <input type="text" placeholder="Description" value={description}
                        onChange = {(event) => {
                            setDescription(event.target.value);
                        }}/>

                        <input type="number" placeholder="Price" value={price}
                        onChange = {(event) => {
                            setPrice(event.target.value);
                        }}/>

                        <input type="text" placeholder="CountInStock" value={countInStock}
                        onChange = {(event) => {
                            setCountInStock(event.target.value);
                        }}/>

                        <div>
                            <Button type='submit' onClick={updateHandler}>Update</Button>
                        </div>

                    </>
                )
            }

        </div>
    )
}


