import express from 'express';
import { listProducts, 
  addProduct, 
  removeProduct, 
  singleProduct, editProduct, importProduct, lowQuantityProducts, topSellingProducts } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';



const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount: 1 },{name:'image2',maxCount: 1 },{name:'image3',maxCount: 1 },{name:'image4',maxCount: 1 }]),addProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
// nhap so luong san pham
productRouter.post('/import', importProduct);
// router để thanh toán
// productRouter.post('/checkout', checkout);
// lay so luong san pham thap nhat
productRouter.get('/low-quantity', lowQuantityProducts);
// lay so luong san pham ban chay nhat
productRouter.get('/top-selling', topSellingProducts);
productRouter.put(
    '/edit/:productId',
    adminAuth,
    upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'image3', maxCount: 1 },
      { name: 'image4', maxCount: 1 },
    ]),
    editProduct
  );
export default productRouter;