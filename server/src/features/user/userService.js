const userRepository = require("./userRepository");
const {updatePersonalInfoSchema, updateAddressSchema} = require("../../validators");

async function getLoggedInUserInfo(userId){
    return await userRepository.getLoggedInUserInfo(userId);
}

// async function deleteMe(myId){
//     const userId = myId;
//     const result = await userRepository.deleteMe(userId);

//     return result;
// }

async function updateMyPersonalInfo(myId, data){
    const { error } = updatePersonalInfoSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    return await userRepository.updateUserById(myId, data);
}

async function updateMyAddress(myId,addId,data){
    const { error } = updateAddressSchema.validate({ addressId:addId, ...data });
    if (error) throw new Error(error.details[0].message);
    return await userRepository.updateAddressById(myId,addId,data);
}

module.exports = {
    getLoggedInUserInfo,
    updateMyPersonalInfo,
    updateMyAddress
}