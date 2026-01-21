const { pool } = require("../../shared/config/db");
const lenderBorrowsRepository = require("./lenderBorrowsRepository");

async function getAllBorrowersForALender(lenderUuid) {
  const client = await pool.connect();
  try {
    return await lenderBorrowsRepository.getAllBorrowsByLender(
      client,
      lenderUuid
    );
  } finally {
    client.release();
  }
}

async function getBorrowById(borrowUuid) {
  const client = await pool.connect();
  try {
    return await lenderBorrowsRepository.getBorrowById(
      client,
      borrowUuid
    );
  } finally {
    client.release();
  }
}

async function approveReturn(borrowUuid) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updated =
      await lenderBorrowsRepository.markReturnApproved(
        client,
        borrowUuid
      );

    if (!updated) {
      throw new Error("Borrow record not found");
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllBorrowersForALender,
  getBorrowById,
  approveReturn
};
