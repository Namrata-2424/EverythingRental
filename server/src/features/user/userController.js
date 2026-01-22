const userService = require("./userService");

async function getLoggedInUserInfo(req,res){
    try{
        const loggedInUserId = req.user.userId;

        const userData = await userService.getLoggedInUserInfo(loggedInUserId);

        if(!userData){
            return res.status(404).json({
                message:"User Not Found!"
            })
        }

        return res.status(200).json(userData);
    }catch(err){
        return res.status(500).json({
            message:`${err.message} Failed to fetch user!` 
        })
    }
}

// async function deleteMe(req,res){
//     try{
//         const myId = req.user.userId;
//         await userService.deleteMe(myId);

//         return res.status(200).json({message:"User Deleted Successfully!"});
//     }catch(err){
//         return res.status(500).json({
//             message:`${err.message} Could not delete user!`
//         })
//     }
// }

async function updateMyPersonalInfo(req,res){
    try{
        const myId = req.user.userId;
        const updateData = req.body;

        if(!updateData ||Object.keys(updateData).length === 0){
            return res.status(400).json({
                message:`No update data provided!`
            })
        }

        const updatedInfo = await userService.updateMyPersonalInfo(myId, updateData);

        return res.status(200).json(updatedInfo);
    }catch(err){
        return res.status(500).json({
            message:`${err.message} Could not update Info! Try again later!`
        })
    }
}

async function updateMyAddress(req,res){
    try{
        const myId = req.user.userId;
        const {addressId} = req.params;
        const updateData = req.body;

        if(!addressId){
            return res.status(400).json({
                message:`Address Id is required`
            })
        }

        if(!updateData || Object.keys(updateData).length === 0){
            return res.status(400).json({
                message:`No update data provided!`
            })
        }

        const updatedAddress = await userService.updateMyAddress(myId,addressId,updateData);

        return res.status(200).json(updatedAddress);
    }catch(err){
        return res.status(500).json({
            message:`${err.message} Could not update address! Try again later!`
        })
    }
}

module.exports = {
    getLoggedInUserInfo,
    updateMyPersonalInfo,
    updateMyAddress
}