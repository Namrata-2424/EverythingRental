const userRepository = require("./userRepository");

async function getLoggedInUserInfo(loggedInUserId){
    const userId = loggedInUserId;
    const userData = await userRepository.getLoggedInUserInfo(userId);

    return userData;
}

// async function deleteMe(myId){
//     const userId = myId;
//     const result = await userRepository.deleteMe(userId);

//     return result;
// }

async function updateMyPersonalInfo(myId, data){
    const userId = myId;
    const updateData = data;
    const updatedInfo = await userRepository.updateUserById(userId,updateData);

    return updatedInfo;
}

async function updateMyAddress(myId,addId,data){
    const userId = myId;
    const addressId = addId;
    const updateData = data;
    const updatedAddress = await userRepository.updateAddressById(userId, addressId, updateData);

    return updatedAddress;
}

module.exports = {
    getLoggedInUserInfo,
    updateMyPersonalInfo,
    updateMyAddress
}