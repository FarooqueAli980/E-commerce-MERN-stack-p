import { Product } from "../models/productModel.js";

// ====================== UPLOAD PRODUCT ======================
export const uploadProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        const userId = req.id;

        if (!name || !description || !price || !category || !image || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a positive number"
            });
        }

        if (isNaN(stock) || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative number"
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock,
            uploadedBy: userId
        });

        return res.status(201).json({
            success: true,
            message: "Product uploaded successfully",
            product: newProduct
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== GET ALL PRODUCTS ======================
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("uploadedBy", "firstName lastName email")
            .populate("reviews.userId", "firstName lastName");

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== GET PRODUCT BY ID ======================
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId)
            .populate("uploadedBy", "firstName lastName email")
            .populate("reviews.userId", "firstName lastName");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== UPDATE PRODUCT (ADMIN ONLY) ======================
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, category, image, stock } = req.body;
        const userId = req.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.uploadedBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this product"
            });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (image) product.image = image;
        if (stock !== undefined) product.stock = stock;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== DELETE PRODUCT (ADMIN ONLY) ======================
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.uploadedBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this product"
            });
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== GET ADMIN'S PRODUCTS ======================
export const getAdminProducts = async (req, res) => {
    try {
        const userId = req.id;

        const products = await Product.find({ uploadedBy: userId })
            .populate("uploadedBy", "firstName lastName email");

        return res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
