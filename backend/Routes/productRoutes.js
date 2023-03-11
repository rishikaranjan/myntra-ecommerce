import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../Models/productModel.js";
import { isAdmin, isAuth } from "../utils.js";




const productRouter = express.Router();


productRouter.get('/', async (req, res) => {

  const products = await Product.find();

  res.send(products);

});



productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {

    const newProduct = new Product({

      name: 'sample name' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      brand: 'sample brand',
      category: 'sample category',
      description: 'sample description',
      price: 0,
      countInStock: 0,
      rating: 0,
      numReviews: 0,

    });


    const product = await newProduct.save();

    res.send({message: 'Product Created', product});


  }) 

  );






  productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {

      const productId = req.params.id;
      const product = await Product.findById(productId);

      if(product) {
        product.name = req.body.name;
        product.slug = req.body.slug;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.description = req.body.description;
        product.price = req.body.price;
        product.countInStock = req.body.countInStock;


        await product.save();

        res.send({message: 'Product Updated'});

      }


      else {

        res.status(404).send({message: 'Product not found'});

      }

    })
  );




productRouter.delete(
  '/:id', 
  isAuth, 
  isAdmin, 
  expressAsyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);

    if(product) {

      await product.remove();

      res.send({message: 'Product is deleted'});
      
    }

    else {
      res.status(404).send({message: 'Product not found'});
    }

  })

);







const PAGE_SIZE = 3;

productRouter.get(
  '/admin', 
  isAuth, 
  isAdmin, 
  expressAsyncHandler(async (req, res) => {

    const {query} = req;
    const page = query.page || 1;

    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);


      const countProducts = await Product.countDocuments();

      res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),

      });

  }) 
  
);







productRouter.get('/slug/:slug', async (req, res) => {

    const product = await Product.findOne({slug: req.params.slug});

    if(product) 
    {
        res.send(product);
    }
    
    else 
    {
        res.status(404).send({message : 'Product Not Found'});
    }
    
});



productRouter.get('/:id', async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (product) 
    {
      res.send(product);
    } 

    else 
    {
      res.status(404).send({ message: 'Product Not Found' });
    }

  });



export default productRouter;