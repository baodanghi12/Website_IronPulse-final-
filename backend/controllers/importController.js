import Import from '../models/importModel.js';
import Product from '../models/productModel.js'; // Sử dụng đúng mô hình Product
import Notification from '../models/notificationModel.js';
// GET /api/imports
export const getAllImports = async (req, res) => {
  try {
    const imports = await Import.find().populate({
  path: 'products.productId',
  model: 'Product',
  select: 'name price sizes image',
});

    const formatted = imports.map((item) => {
      const productDetails = item.products.map((p) => {
        const product = p.productId || {};
        const name = product.name || 'Không xác định';
        const price = product.price || 0;
        const cost = p.cost || 0;
        const sizes = p.sizes || [];

        const quantity = sizes.reduce((sum, s) => sum + (s.quantity || 0), 0);
        const totalCost = sizes.reduce((sum, s) => sum + ((s.quantity || 0) * cost), 0);

        return {
          name,
          price,
          cost,
          quantity,
          sizes, // giữ nguyên để client hiển thị chi tiết theo size
           image: product.image || [],
        };
      });

      const totalQuantity = productDetails.reduce((acc, p) => acc + p.quantity, 0);
      const totalCost = productDetails.reduce((acc, p) => acc + (p.cost * p.quantity), 0);

      return {
        _id: item._id,
        importDate: item.importDate,
        note: item.note || '',
        productDetails,
        productNames: productDetails.map(p => p.name).join(', '),
        totalQuantity,
        totalCost,
      };
    });

    res.json({ data: formatted });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhập hàng:', error);
    res.status(500).json({
      message: 'Lỗi server khi lấy danh sách nhập hàng',
      error: error.message,
    });
  }
};


export const createImport = async (req, res) => {
  try {

    const { products, importDate, note, totalCost } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required!' });
    } 

    // Chuyển đổi sản phẩm thành dạng dễ lưu vào MongoDB
    const formattedProducts = products.map((product) => {
      const formattedSizes = product.sizes.map((s) => ({
        size: s.size,
        quantity: s.quantity,
      }));


      return {
        productId: product.productId,
        cost: product.cost, // Lấy cost từ phiếu nhập
        sizes: formattedSizes,
      };
    });


    // Tạo một phiếu nhập mới
    const importRecord = new Import({
      products: formattedProducts,
      totalCost,
      importDate: new Date(),
      note: note || '',
    });

    // Lưu phiếu nhập vào MongoDB
    await importRecord.save();
        await Notification.create({
      type: 'success',
      title: '📦 Nhập hàng mới',
      content: `Đã nhập ${formattedProducts.length} sản phẩm với tổng chi phí ${totalCost.toLocaleString()} VND`,
      link: '/admin/imports',
      isRead: false,
      createdAt: new Date()
    });
    // Cập nhật lại số lượng và cost cho các sản phẩm
    for (const product of formattedProducts) {
      for (const size of product.sizes) {
        // Cập nhật số lượng và cost cho sản phẩm
        const updatedProduct = await Product.findByIdAndUpdate(
          product.productId,
          {
            $inc: { // Tăng số lượng của size tương ứng
              'sizes.$[elem].quantity': size.quantity,
            },
            $set: {
              'cost': product.cost, // Cập nhật cost từ phiếu nhập vào sản phẩm
            }
          },
          {
            arrayFilters: [{ 'elem.size': size.size }], // Lọc size trong mảng sizes
            new: true // Trả về đối tượng đã được cập nhật
          }
        );
      }
    }

    return res
      .status(201)
      .json({ success: true, message: 'Import record created and products updated successfully!' });
  } catch (error) {
    console.error('Error creating import:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



 





