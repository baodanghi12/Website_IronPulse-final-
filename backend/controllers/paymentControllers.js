
const getStatistics = async (req, res) => {
    try {
      const sales = await BillModel.find({}).lean(); // để thao tác đơn giản
      const imports = await ImportModel.find({}).lean(); // lấy toàn bộ import
  
      // Tạo Map để tra nhanh cost theo productId
      const costMap = new Map();
  
      // Duyệt tất cả import để ghi nhớ cost của từng productId
      for (const imp of imports) {
        for (const product of imp.products) {
          const id = product.productId.toString();
          // Luôn ghi đè với import mới hơn (nếu cần: sort trước hoặc chỉ lấy latest)
          costMap.set(id, product.cost);
        }
      }
  
      // Gắn cost vào mỗi product trong sale
      for (const sale of sales) {
        for (const product of sale.products) {
          const id = product.productId.toString();
          product.cost = costMap.get(id) || 0; // nếu không có thì cost = 0
        }
      }
  
      res.status(200).json({
        message: 'Successfully',
        data: { sales },
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };
  
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
const updatedBill = async (req, res) =>{
    const {id} = req.query;
    const body = req.body;
    try {
        console.log(body);
        res.status(200).json({
            message:'success',
            data:[],
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
export {
    getStatistics, getBills, updatedBill
}