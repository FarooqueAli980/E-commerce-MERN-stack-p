import express from 'express';
import {
    uploadProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getAdminProducts
} from '../controllers/productController.js';
import { isAuthincated, isAdmin } from '../middleware/isAuthinticated.js';

const router = express.Router();

// Public routes
router.get('/all', getAllProducts);
router.get('/:productId', getProductById);

// Admin routes (authentication required)
router.post('/upload', isAuthincated, isAdmin, uploadProduct);
router.put('/:productId', isAuthincated, isAdmin, updateProduct);
router.delete('/:productId', isAuthincated, isAdmin, deleteProduct);
router.get('/admin/products', isAuthincated, isAdmin, getAdminProducts);

export default router;
