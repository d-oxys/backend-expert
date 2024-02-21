/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
const ThreadRepository = require('../../Domains/threads/threadRepo');
const AddedThread = require('../../Domains/threads/entities/addedThreads');
const ThreadDetail = require('../../Domains/threads/entities/detailThreads');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const id = `thread-${this._idGenerator()}`;
    const { title, body, owner } = newThread;

    const query = {
      text: `INSERT INTO threads (id, title, body, owner)
             VALUES($1, $2, $3, $4)
             RETURNING id, title, owner`,
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }
  }

  async getDetailThread(threadId) {
    const query = {
      text: 'SELECT threads.id, title, body,  date, username FROM threads LEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan di database');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
