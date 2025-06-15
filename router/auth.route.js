const { Router } = require("express")
const { register, login, addAdmin, deleteAdmin } = require("../controller/auth.ctr")
const { checkSuperAdmin } = require("../guard/superAdmin")


const authRouter=Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.put("/add_admin", checkSuperAdmin, addAdmin)
authRouter.delete("/delete_admin", checkSuperAdmin, deleteAdmin)

module.exports=authRouter