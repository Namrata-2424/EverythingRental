const squel = require("squel").useFlavour("postgres");

async function findUserByEmail(client,email){
    const q = squel.select().from('users').where('email = ?',email);
    const {text,values} = q.toParam();
    const res = await client.query(text,values);
    return res.rows[0];
}

async function createUserWithAddress(client, userData, addressData){
    const userQuery = squel
    .insert()
    .into('users')
    .set('first_name',userData.firstName)
    .set('last_name',userData.lastName)
    .set('username',userData.userName)
    .set('email',userData.email)
    .set('phone_number',userData.phoneNumber)
    .set('user_password',userData.hashedPassword)
    .returning('user_uuid,email');

    const {text:userSQL,values:userValues} = userQuery.toParam();
    const userResult = await client.query(userSQL,userValues);
    const user = userResult.rows[0];

    const addressQuery = squel
    .insert()
    .into('addresses')
    .set('user_uuid', user.user_uuid)
    .set('city', addressData.city)
    .set('locality', addressData.locality)
    .set('pincode', addressData.pincode)
    .set('state_name', addressData.stateName)
    .set('country', addressData.country);

    const {text:addressSQL,values:addressValues} = addressQuery.toParam();
    await client.query(addressSQL,addressValues);

    return user;
}

module.exports = {
    findUserByEmail,
    createUserWithAddress
}