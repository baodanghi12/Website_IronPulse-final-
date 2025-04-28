import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './router/userRoute.js';
import productRouter from './router/productRoute.js';
import cartRouter from './router/cartRoute.js';
import orderRouter from './router/orderRoute.js';
import PaymentRouter from './router/paymentRoute.js';
import SupplierRouter from './router/supplierRoute.js';
import statisticsRoutes from './router/statisticsRoutes.js'
import reportRouter from './router/reportRouter.js'
import adminRouter from './router/adminRouter.js'
import notificationRoute from './router/notificationRoute.js';
import importRoutes from './router/importRoutes.js'
// import { logMiddleware } from './middleware/logMiddleware.js';
// import LogModel from './models/LogModel.js';
// import { createdAt } from '../admin/src/models/LogModel.js';
import promotionRouter from './router/promotionRouter.js'
import uploadRouter from './router/upload.js';
import cookieParser from 'cookie-parser';
import authRouter from './router/authRoute.js';
// App Config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }));

// app.use(logMiddleware);

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/imports', importRoutes);
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/report', reportRouter)
app.use('/payments', PaymentRouter)
app.use('/supplier', SupplierRouter)
app.use('/admin', adminRouter)
app.use('/api/statistics', statisticsRoutes)
app.use('/api/upload', uploadRouter)
app.use('/uploads', express.static('public/uploads'));
app.use('/api/promotions', promotionRouter)
app.use('/api/notifications', notificationRoute);
app.use('/api/auth', authRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port ))