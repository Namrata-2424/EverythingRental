const userRepository = require("./userRepository");
const {updatePersonalInfo, updateAddress} = require("../../validators");

async function getLoggedInUserInfo(userId){
    return await userRepository.getLoggedInUserInfo(userId);
}

// async function deleteMe(myId){
//     const userId = myId;
//     const result = await userRepository.deleteMe(userId);

//     return result;
// }

async function updateMyPersonalInfo(myId, data){
    const { error } = updatePersonalInfo.validate(data);
    if (error) throw new Error(error.details[0].message);
    return await userRepository.updateUserById(myId, data);
}

async function updateMyAddress(myId,addId,data){
    const { error } = updateAddress.validate({ addressId, ...data });
    if (error) throw new Error(error.details[0].message);
    return await userRepository.updateAddressById(myId,addId,data);
}

module.exports = {
    getLoggedInUserInfo,
    updateMyPersonalInfo,
    updateMyAddress
}