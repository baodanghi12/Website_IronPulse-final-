// BillModel.js

// Định nghĩa Product
const Product = {
    _id: String,
    createdBy: String,
    count: Number,
    cost: Number,
    subProductId: String,
    image: String,
    color: String,
    price: Number,
    qty: Number,
    productId: String,
    title: String,
    __v: Number
};

// Định nghĩa ShippingAddress
const ShippingAddress = {
    address: String,
    _id: String
};

// Định nghĩa BillModel
const BillModel = {
    _id: String,
    products: [Product], // Mảng chứa các sản phẩm
    total: Number,
    status: String,
    customer_id: String,
    shippingAddress: ShippingAddress,
    paymentStatus: Number,
    paymentMethod: String,
    createdAt: String,
    updatedAt: String,
    __v: Number
};
export { BillModel, Product, ShippingAddress };
export default BillModel;

