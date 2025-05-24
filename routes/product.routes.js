const express=require('express')
const productController=require('../controllers/product.controllers')
const router=express.Router()
const upload = require("../middlewares/cloudinary");

router.post("/addProduct",productController.addProduct)
// Upload Image Route
router.post("/uploadImages", upload.array("images", 8), productController.addImages);

module.exports=router