import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch admin products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/admin/products",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.image ||
      formData.stock === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        // Update product
        const res = await axios.put(
          `http://localhost:8000/api/v1/product/${editingId}`,
          {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.data.success) {
          toast.success("Product updated successfully");
          setProducts(
            products.map((p) => (p._id === editingId ? res.data.product : p))
          );
          resetForm();
        }
      } else {
        // Upload new product
        const res = await axios.post(
          "http://localhost:8000/api/v1/product/upload",
          {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.data.success) {
          toast.success("Product uploaded successfully");
          setProducts([...products, res.data.product]);
          resetForm();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
    });
    setIsEditing(true);
    setEditingId(product._id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Upload and manage your products</p>
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Product" : "Upload New Product"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Update product details"
                : "Add a new product to your store"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Summer Dress"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g., Clothing, Accessories"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Price */}
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="999.99"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Stock */}
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="50"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              {/* Image URL */}
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded mt-2"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isEditing ? (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Product
                    </>
                  )}
                </Button>

                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Products ({products.length})
          </h2>

          {loading && !products.length ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-pink-600 font-bold text-lg">
                        ₹{product.price}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mb-4">
                      {product.category}
                    </span>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="outline"
                        size="sm"
                        className="flex-1 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        onClick={() => handleDelete(product._id)}
                        variant="destructive"
                        size="sm"
                        className="flex-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-8">
                <p className="text-center text-gray-600 py-8">
                  No products uploaded yet. Create your first product above!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
