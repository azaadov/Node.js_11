const {Router}=require("express")
const {getAllProduct, addProduct, updateProduct, deleteProduct}=require("../controller/product.ctr")
const { checkAdmin } = require("../guard/adminCheker")



const productRouter=Router()

productRouter.get("/get_all_products", getAllProduct)
productRouter.post("/add_product", checkAdmin, addProduct)  
productRouter.put("/update_product/:id", checkAdmin, updateProduct)
productRouter.delete("/delete_product/:id",checkAdmin, deleteProduct)

module.exports=productRouter