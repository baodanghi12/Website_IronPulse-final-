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
// import { logMiddleware } from './middleware/logMiddleware.js';
// import LogModel from './models/LogModel.js';
// import { createdAt } from '../admin/src/models/LogModel.js';

// App Config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// app.use(logMiddleware);

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/report', reportRouter)
app.use('/payments', PaymentRouter)
app.use('/supplier', SupplierRouter)
app.use('/admin', adminRouter)
app.use('/api/statistics', statisticsRoutes)
// app.get('/logs', async (req, res) => {
    // try {
    //     const items = await LogModel.find()
    //     .sort({createdAt: -1})
    //     .skip((pageNumber -1) * limitNumber)
    //     .limit(limitNumber);

    //     res.status(200).json({
    //         message:'Logs',
    //         data:{
    //             items,
    //             total: await LogModel.countDocuments(),
    //         },
    //     });
    // } catch (error) {
    //     res.status(404).json({message: 'Error'});
    // }

// });


app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port ))