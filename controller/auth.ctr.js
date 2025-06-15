const {read_file, write_file}=require("../fs/dataTransformer")
const { v4 } = require("uuid");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



//////////REGISTER/////////////////

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username && !email && !password) {
            return res.status(401).json({
                msg: "username, email, password are required!"
            })
        }
        const fileData = read_file("users.json")

        const foundedEmail = fileData.find((item) => item.email === email)

        if (foundedEmail) {
            return res.status(401).json({
                msg: "email already exists!"
            })
        }

        const foundedUsername = fileData.find((item) => item.username === username)

        if (foundedUsername) {
            return res.status(401).json({
                msg: "username already exists!"
            })
        }

        const hashPassword = await bcrypt.hash(password, 8);
        fileData.push({
            id: v4(),
            username,
            email,
            password: hashPassword,
            role:"user"
        })
        write_file("users.json", fileData)
        res.status(201).json({msg:"Registered"})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}



//////////////LOGIN/////////////

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email && !password) {
            return res.status(401).json({
                msg: "email and password are require!"
            })
        }

        const fileData = read_file("users.json")

        const foundedUser = fileData.find((item) => item.email === email)
        if (!foundedUser) {
            return res.status(404).json({
                msg: "user not found!"
            })
        }

        const decode = await bcrypt.compare(password, foundedUser.password)
        if (decode) {
            const payload = { id: foundedUser.id, email: foundedUser.email, role:foundedUser.role }
            const token = jwt.sign(payload, process.env.SEKRET_KEY, { expiresIn: "1h" })
            return res.status(200).json({
                msg: "success",
                token
            })
        } else {
            return res.status(401).json({
                msg: "invalid password!"
            })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const addAdmin = async (req, res) => {
    try {
        const { email, password, adminId } = req.body

        const fileData = read_file("users.json")

        const foundedUser = fileData.find((item) => item.email === email)
        if (!foundedUser) {
            return res.status(404).json({
                msg: "user not found!"
            })
        }

        const decode = await bcrypt.compare(password, foundedUser.password)
        if (decode) {
            const foundedUser=fileData.find((item)=> item.id===adminId)
            if (!foundedUser) {
                return res.status(404).json({
                    msg: "user not found!"
                })
            }

            fileData.forEach((item)=>{
                if(item.id===adminId){
                    item.role="admin"
                }
            })
            write_file("users.json", fileData)
            res.status(201).json({
                msg: "added admin"
            })
        } else {
            return res.status(401).json({
                msg: "invalid password!"
            })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


const deleteAdmin = async (req, res) => {
    try {
        const { email, password, adminId } = req.body

        const fileData = read_file("users.json")

        const foundedUser = fileData.find((item) => item.email === email)
        if (!foundedUser) {
            return res.status(404).json({
                msg: "user not found!"
            })
        }

        const decode = await bcrypt.compare(password, foundedUser.password)
        if (decode) {
            const foundedUser=fileData.find((item)=> item.id===adminId)
            if (!foundedUser) {
                return res.status(404).json({
                    msg: "user not found!"
                })
            }

            fileData.forEach((item, idx)=>{
                if(item.id===adminId){
                    fileData.splice(idx, 1)
                }
            })
            write_file("users.json", fileData)
            res.status(201).json({
                msg: "delete admin"
            })
        } else {
            return res.status(401).json({
                msg: "invalid password!"
            })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}




module.exports = {
    register,
    login,
    addAdmin,
    deleteAdmin
}