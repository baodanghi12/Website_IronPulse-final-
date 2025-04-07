
const getStatistics = async (req ,res) => {
    try {
        const sales = await BillModel.find({});
        res.status(200).json({
            message:'Successfully',
            data: {sales},
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
        });        
    }
    
}
const getBills = async (req,res ) =>{
    // lấy thông tin ai mua, bao nhiêu sản phẩm, tổng tiền, trạng thái đơn hàng
    const {page, limit} = req.query;
    const pageNumber = parseInt(page ) || 1;
    const limitNumber = parseInt(limit) || 20;
    const skip = (pageNumber -1) * limitNumber;
    try {
        const items = await BillModel.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limitNumber);

        res.status(200).json({
            message:'Success',
            data:{
                items,
                total: await LogModel.countDocuments(),
            },
        });
    } catch (error) {
        res.status(404).json({message: 'Error'});
    }
}
export {
    getStatistics, getBills
}