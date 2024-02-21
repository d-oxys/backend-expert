/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({ id = 'reply-123', comment_id = 'comment-123', content = 'sebuah balasan', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO replies (id, comment_id, content, owner, is_deleted) VALUES($1, $2, $3, $4, $5)',
      values: [id, comment_id, content, owner, false],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0]; // return the first row
  },

  async checkIsDeletedRepliesById(id) {
    const query = {
      text: 'SELECT is_deleted FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
