/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({ id = 'TH-1', title = 'title', body = 'body', date = new Date(), owner = 'dicodingTest' }) {
    const query = {
      text: `INSERT INTO threads (id, title, body, date, owner)
             VALUES($1, $2, $3, $4, $5)
             RETURNING id`,
      values: [id, title, body, date, owner],
    };

    const result = await pool.query(query);

    return result.rows[0].id;
  },

  async findThreadsById(id) {
    const query = {
      text: `SELECT * FROM threads WHERE id = $1`,
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
