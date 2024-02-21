const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/commentRepo');
const AddedComment = require('../../Domains/comments/entities/addedComments');
const AddedReply = require('../../Domains/comments/entities/addedReplys');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment_THR_${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, FALSE ,$5, $5) RETURNING id, content, owner',
      values: [id, thread, content, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async checkAvailabilityComment(comment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan di database');
    }
  }

  async verifyCommentOwner(comment, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('anda tidak bisa menghapus komentar orang lain.');
    }
  }

  async deleteComment(comment) {
    const query = {
      text: 'UPDATE comments SET is_deleted=TRUE WHERE id = $1',
      values: [comment],
    };

    await this._pool.query(query);
  }

  async getCommentsThread(thread) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.created_at as date, comments.content, comments.is_deleted FROM comments LEFT JOIN users ON users.id = comments.owner WHERE thread = $1 ORDER BY comments.created_at ASC',
      values: [thread],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

  async addReply(newReply) {
    const { content, comment, owner } = newReply;
    const id = `reply_${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies (id, comment_id, content, owner, is_deleted, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, comment, content, owner, false, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async deleteReply(reply) {
    const query = {
      text: 'UPDATE replies SET is_deleted=TRUE WHERE id = $1',
      values: [reply],
    };

    await this._pool.query(query);
  }

  async checkAvailabilityReply(replyId) {
    const query = {
      text: 'SELECT 1 FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('REPLY_NOT_FOUND');
    }
  }

  async verifyReplyOwner(replyId, ownerId) {
    const query = {
      text: 'SELECT 1 FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('REPLY_OWNER_NOT_MATCH');
    }
  }

  async getRepliesComment(threadId) {
    const query = {
      text: `SELECT replies.id, replies.comment_id, comments.thread AS threadId, replies.content, replies.owner, replies.created_at, replies.updated_at, replies.is_deleted, users.username 
              FROM replies 
              JOIN comments ON replies.comment_id = comments.id 
              JOIN users ON replies.owner = users.id 
              WHERE comments.thread = $1`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
