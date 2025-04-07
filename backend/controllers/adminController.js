import { Request, Response } from 'express';
const getTotalProfit = async (req, res) => {
    try {
        res.status(200).json({
            profitMonth:123,
            profitYear:123,
            bills: [],
            orders: [],
            revenue: 123,
        })
    } catch (error) {
        res.status(404).send({message:error.message});
    }
}
export { getTotalProfit };