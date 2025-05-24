const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { client } = require("../config/db");
// Add Product
const addProduct = asyncHandler(async (req, res) => {
    console.log("I am in add Product function");

    const { productname, description, price, stock, categoryid } = req.body;

    // Validate required fields
    if (!productname || productname.trim() === "") {
        return res.status(400).json(new ApiError(400, "Product name is required"));
    }
    if (!price) {
        return res.status(400).json(new ApiError(400, "Price is required"));
    }
    if (!categoryid) {
        return res.status(400).json(new ApiError(400, "Category ID is required"));
    }

    // Check if category exists
    const categoryCheckQuery = "SELECT categoryid FROM category WHERE categoryid = $1";
    const categoryExists = await client.query(categoryCheckQuery, [categoryid]);

    if (categoryExists.rows.length === 0) {
        return res.status(404).json(new ApiError(404, "Category not found"));
    }

    // Insert product into database
    const insertProductQuery = `
        INSERT INTO product (productname, description, price, stock, categoryid)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    
    const newProduct = await client.query(insertProductQuery, [
        productname.trim(), description?.trim() || null, price, stock || 0, categoryid
    ]);

    return res.status(201).json(new ApiResponse(201, newProduct.rows[0], "Product added successfully"));
});

// Add Image
const addImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json(new ApiError(400, "No images uploaded"));
    }

    const uploadedImages = req.files.map(file => file.path); // Cloudinary URLs

    return res.status(201).json(new ApiResponse(201, { images: uploadedImages }, "Images uploaded successfully"));
});


module.exports = { addProduct,addImages };
