const { read_file, write_file } = require("../fs/dataTransformer");
const {v4}=require("uuid")


const getAllProduct=async (req, res)=>{
    try {
        const fileData=read_file("product.json")
        res.status(200).json(fileData)
    } catch (error) {
        console.log(error);
    }
}

const addProduct=async (req, res)=>{
    try {
        const {title, desc, price}=req.body
        const fileData=read_file("product.json")
        fileData.push({
          id:v4(),
          title,
          desc,
          price
        })
        write_file("product.json", fileData)
        res.status(201).json({
            msg:"added new data"
        })
    } catch (error) {
        console.log(error);
    }
}

const updateProduct=async (req, res)=>{
    try {
        const {id}=req.params
        const {title, desc, price}=req.body
        const fileData=read_file("product.json")
        const foundedProduct=fileData.find((item)=> item.id===id)
        if(!foundedProduct){
            return res.status(404).json({
                msg:"product not found"
            })
        }

        fileData.forEach((item) => {
            if(item.id===id){
                item.title=title ? title : item.title
                item.desc=desc ? desc : item.desc
                item.price=price ? price : item.price
            }
        });
        write_file("product.json", fileData)
        res.status(201).json({
            msg:"update product"
        })
    } catch (error) {
        console.log(error);
    }
}

const deleteProduct=async (req, res)=>{
    try {
        const {id}=req.params
        const fileData=read_file("product.json")
        const foundedProduct=fileData.find((item)=> item.id===id)
        if(!foundedProduct){
            return res.status(404).json({
                msg:"product not found"
            })
        }

        fileData.forEach((item, idx) => {
            if(item.id===id){
                fileData.splice(idx, 1)
            }
        });
        write_file("product.json", fileData)
        res.status(201).json({
            msg:"deleted product"
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    getAllProduct,
    addProduct,
    updateProduct,
    deleteProduct
}