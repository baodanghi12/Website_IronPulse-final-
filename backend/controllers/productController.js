import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js"

// function for add product
const addProduct =async (req, res) => {
    try {
        console.log("Files received: ", req.files);

        const { name, description, price, category, subCategory, sizes, bestseller, colors } = req.body;
        const parsedColors = JSON.parse(colors);
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item)=> item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );
        

        const productData = {
            name,
            description,
            price: Number(price),
            image: imagesUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller: bestseller === "true" ? true : false,
            colors: parsedColors,
            date: Date.now()
        }


        const product = new productModel(productData)
        await product.save()

        res.json({success: true, message: "Product added successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for list products
const listProducts =async (req, res) => {
    try {
        
        const products = await productModel.find({})
        res.json({success: true, products})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for remove product
const removeProduct =async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product removed successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for single product info
const singleProduct =async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
const editProduct = async (req, res) => {
    console.log('Received files:', req.files);
    try {
        const {
            name,
            price,
            sizes,
            colors,
            description,
            category,
            subCategory,
            bestSeller,
            flashSale,
        } = req.body;

        const productId = req.params.productId;

        // Kiểm tra sản phẩm có tồn tại không
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Khởi tạo object chứa thông tin cập nhật
        const updateData = {};

        // Cập nhật nếu có dữ liệu
        if (name != null) updateData.name = name;
        if (description != null) updateData.description = description;
        if (price != null) updateData.price = price;

        if (sizes != null) {
            try {
                updateData.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
            } catch (err) {
                console.error("Error parsing sizes:", err);
            }
        }

        if (colors != null) {
            try {
                updateData.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
            } catch (err) {
                console.error("Error parsing colors:", err);
            }
        }

        if (category != null) updateData.category = category;
        if (subCategory != null) updateData.subCategory = subCategory;
        if (bestSeller != null) updateData.bestSeller = bestSeller;
        if (flashSale != null) updateData.flashSale = flashSale;

        // Xử lý ảnh nếu có upload
        const images = req.files ? Object.values(req.files).map(file => file[0].path) : [];

        if (images.length > 0) {
            updateData.image = images;
        }

        // DEBUG: Kiểm tra dữ liệu gửi lên
        console.log("Update data for product:", productId);
        console.log(updateData);

        // Nếu không có gì để cập nhật, trả về lỗi
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid data provided to update',
            });
        }

        // Thực hiện cập nhật
        const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, {
            new: true,
            runValidators: true,
        });

        // Kiểm tra kết quả
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found for update',
            });
        }

        // Thành công
        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the product',
            error: error.message,
        });
    }
};


  



export {listProducts, addProduct, removeProduct, singleProduct, editProduct,}