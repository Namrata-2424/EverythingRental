const squel = require("squel").useFlavour("postgres");
const {pool} = require("../../shared/config/db");

async function getLoggedInUserInfo(userId){
    const userInfoQuery = `
      SELECT 
        u.first_name,
        u.last_name,
        u.username,
        u.phone_number,
        u.email,
        u.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'city',a.city,
              'locality',a.locality,
              'pincode',a.pincode,
              'State',a.state_name,
              'Country',a.country)
            )FILTER (WHERE a.address_uuid IS NOT NULL),
            '[]'
        ) AS addresses
      FROM users as u
      LEFT JOIN addresses as a
      ON u.user_uuid = a.user_uuid
      WHERE u.user_uuid = $1
      GROUP BY u.user_uuid
    `
    const result = await pool.query(userInfoQuery,[userId]);

    return result.rows[0];
}

// async function deleteMe(userId){
//     const deleteQuery = squel
//       .delete()
//       .from('users')
//       .where('user_uuid = ?',userId)

//     const {text, values} = deleteQuery.toParam();
//     const res = await pool.query(text,values);

//     if (res.rowCount === 0) {
//       throw new Error("User not found");
//     }

//     return {success:true};
// }

async function updateUserById(userId,data){
    const fields = [];
    const values = [];
    let index = 1;

    if(data.firstName){
        fields.push(`first_name = $${index++}`);
        values.push(data.firstName);
    }
    if(data.lastName){
        fields.push(`last_name = $${index++}`);
        values.push(data.lastName);
    }
    if(data.username){
        fields.push(`username = $${index++}`);
        values.push(data.username);
    }
    if(data.phoneNumber){
        fields.push(`phone_number = $${index++}`);
        values.push(data.phoneNumber);
    }

    if(fields.length === 0){
        throw new Error("No valid personal fields to update!");
    }

    const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE user_uuid = $${index}
    RETURNING
      first_name,
      last_name,
      username,
      email,
      phone_number,
      karma_point,
      created_at;
    `;

    values.push(userId);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error("User not found!");
    }

    return result.rows[0];
}

async function updateAddressById(userId, addressId, data){
  const fields = [];
  const values = [];
  let index = 1;

  if(data.city){
    fields.push(`city = $${index++}`);
    values.push(data.city);
  }

  if(data.locality){
    fields.push(`locality = $${index++}`);
    values.push(data.locality);
  }

  if(data.pincode){
    fields.push(`pincode = $${index++}`);
    values.push(data.pincode);
  }

  if(data.stateName){
    fields.push(`state_name = $${index++}`);
    values.push(data.stateName);
  }

  if(data.country){
    fields.push(`country = $${index++}`);
    values.push(data.country);
  }

  if(fields.length === 0){
    throw new Error("No updates!")
  }

  const query = `
    UPDATE addresses
    SET ${fields.join(', ')}
    WHERE address_uuid = $${index} AND user_uuid = $${index + 1} 
    RETURNING 
      city,
      locality,
      pincode,
      state_name,
      country;
  `

  values.push(addressId, userId);

  const result = await pool.query(query,values);

  if (result.rowCount === 0) {
    throw new Error("No address found");
  }

  return result.rows[0];
}

module.exports = {
    getLoggedInUserInfo,
    updateUserById,
    updateAddressById
}