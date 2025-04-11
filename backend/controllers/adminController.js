import express from 'express';
const { Request, Response } = express;

const getTotalProfit = async (req, res) => {
    try {
        res.status(200).json({
            profitMonth: 123,
            profitYear: 123,
            bills: [],
            orders: [],
            revenue: 123,
        });
    } catch (error) {
        console.error(error);  // Ghi lại lỗi vào console
        res.status(404).send({ message: error.message });
    }
}

const getOrderAndPurchase = async (req, res) => {
    const { timeType } = req.query;
    try {
        console.log(timeType);
        res.status(200).send({ message: 'Get order and purchase successfully' });
    } catch (error) {
        console.error(error);  // Ghi lại lỗi vào console
        res.status(404).send({ message: error.message });
    }
};

export { getTotalProfit, getOrderAndPurchase };
