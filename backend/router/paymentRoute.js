import { getBills, getStatistics } from "../controllers/paymentControllers.js";
import express from 'express';

const Router = express.Router();

Router.get('/statistic',getStatistics)
Router.get('/bills', getBills)

export default Router;