/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
const CommentsTableTestHelper = require('../../../../tests/commentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/repliesTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/threadsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/addComments');
const AddReply = require('../../../Domains/comments/entities/replyComments');
const AddedComment = require('../../../Domains/comments/entities/addedComments');
const AddedReply = require('../../../Domains/comments/entities/addedReplys');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {}); // Dummy dependency

    expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addComment function', () => {
      it('should persist new comment and return added comment correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-1234567', username: 'dicoding-test' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', body: 'sebuah thread', owner: 'user-1234567' });

        const newComment = new AddComment({
          content: 'sebuah komentar',
          thread: 'thread-123',
          owner: 'user-1234567',
        });

        const fakeIdGenerator = () => '123456789abcdef';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        const addedComment = await commentRepositoryPostgres.addComment(newComment);

        const comment = await CommentsTableTestHelper.findCommentsById('comment_THR_123456789abcdef');
        expect(addedComment).toStrictEqual(
          new AddedComment({
            id: 'comment_THR_123456789abcdef',
            content: 'sebuah komentar',
            owner: 'user-1234567',
          })
        );
        expect(comment).toBeDefined();
      });
    });

    describe('checkAvailabilityComment function', () => {
      it('should throw NotFoundError if comment not available', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const comment = 'xxx';

        // Action & Assert
        await expect(commentRepositoryPostgres.checkAvailabilityComment(comment)).rejects.toThrow(NotFoundError);
      });

      it('should not throw NotFoundError if comment available', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123456799', username: 'dicoding-test1' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123456', body: 'sebuah thread', owner: 'user-123456799' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_123456',
          content: 'sebuah komentar',
          thread: 'thread-123456',
          owner: 'user-123456799',
        });

        // Action & Assert
        await expect(commentRepositoryPostgres.checkAvailabilityComment('comment_THR_123456')).resolves.not.toThrow(NotFoundError);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should throw AuthorizationError if comment not belong to owner', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123456999', username: 'dicoding-test' });
        await UsersTableTestHelper.addUser({ id: 'user-123459999', username: 'dicoding-test11' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-1234567', body: 'sebuah thread', owner: 'user-123456999' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_1234567',
          content: 'sebuah komentar',
          thread: 'thread-1234567',
          owner: 'user-123456999',
        });
        const comment = 'comment_THR_1234567';
        const owner = 'user-123459999';

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner(comment, owner)).rejects.toThrow(AuthorizationError);
      });

      it('should not throw AuthorizationError if comment is belongs to owner', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123499999', username: 'dicoding-test12' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-12345678', body: 'sebuah thread', owner: 'user-123499999' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_123456789',
          content: 'sebuah komentar',
          thread: 'thread-12345678',
          owner: 'user-123499999',
        });

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyCommentOwner('comment_THR_123456789', 'user-123499999')).resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('addReply function', () => {
      it('should persist new reply and return added reply correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-1234567', username: 'dicoding-test' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'sebuah judul thread', body: 'sebuah thread', owner: 'user-1234567' });
        await CommentsTableTestHelper.addComment({ id: 'comment_THR_123456789abcdef', content: 'sebuah komentar', thread: 'thread-123', owner: 'user-1234567' });
        const newReply = new AddReply({
          content: 'sebuah balasan',
          comment: 'comment_THR_123456789abcdef',
          owner: 'user-1234567',
        });

        const fakeIdGenerator = () => '123456789abcdef';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Action
        const addedReply = await commentRepositoryPostgres.addReply(newReply);

        // Assert
        const reply = await RepliesTableTestHelper.findRepliesById('reply_123456789abcdef');
        expect(addedReply).toStrictEqual(
          new AddedReply({
            id: 'reply_123456789abcdef',
            content: 'sebuah balasan',
            owner: 'user-1234567',
          })
        );
        expect(reply).toBeDefined();
        // expect(reply).toHaveLength(1);
      });
    });

    describe('checkAvailabilityReply function', () => {
      it('should throw NotFoundError when reply does not exist', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const replyId = 'reply-123';

        // Action & Assert
        await expect(commentRepositoryPostgres.checkAvailabilityReply(replyId)).rejects.toThrowError('REPLY_NOT_FOUND');
      });

      it('should not throw NotFoundError when reply exists', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const replyId = 'reply-123';
        await UsersTableTestHelper.addUser({ id: 'user-123456799', username: 'dicoding-test1' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123456', body: 'sebuah thread', owner: 'user-123456799' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_123456',
          content: 'sebuah komentar',
          thread: 'thread-123456',
          owner: 'user-123456799',
        });
        await RepliesTableTestHelper.addReply({
          id: replyId,
          comment_id: 'comment_THR_123456',
          content: 'balasan',
          owner: 'user-123456799',
        });

        // Action & Assert
        await expect(commentRepositoryPostgres.checkAvailabilityReply(replyId)).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('deleteReply function', () => {
      it('should delete reply from database', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123999999', username: 'dicoding-test' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123456789', body: 'sebuah thread', owner: 'user-123999999' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_1234567810',
          content: 'sebuah komentar',
          thread: 'thread-123456789',
          owner: 'user-123999999',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply_123456789abcdef',
          comment_id: 'comment_THR_1234567810',
          content: 'balasan hapus',
          owner: 'user-123999999',
        });

        // Action
        await commentRepositoryPostgres.deleteReply('reply_123456789abcdef');

        // Assert
        const reply = await RepliesTableTestHelper.checkIsDeletedRepliesById('reply_123456789abcdef');
        expect(reply.is_deleted).toBe(true);

        // Verify is_deleted field
        const deletedReply = await RepliesTableTestHelper.findRepliesById('reply_123456789abcdef');
        expect(deletedReply.is_deleted).toBe(true);
      });
    });

    describe('verifyReplyOwner function', () => {
      it('should throw error when owner does not match', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const replyId = 'reply-123';
        const ownerId = 'user-123';

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyReplyOwner(replyId, ownerId)).rejects.toThrowError('REPLY_OWNER_NOT_MATCH');
      });

      it('should not throw error when owner matches', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const replyId = 'reply-123';
        const ownerId = 'user-123456799';
        await UsersTableTestHelper.addUser({ id: 'user-123456799', username: 'dicoding-test1' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123456', body: 'sebuah thread', owner: 'user-123456799' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_123456',
          content: 'sebuah komentar',
          thread: 'thread-123456',
          owner: 'user-123456799',
        });
        await RepliesTableTestHelper.addReply({
          id: replyId,
          comment_id: 'comment_THR_123456',
          content: 'balasan',
          owner: ownerId,
        });

        // Action & Assert
        await expect(commentRepositoryPostgres.verifyReplyOwner(replyId, ownerId)).resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('getRepliesComment function', () => {
      it('should return replies correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const threadId = 'thread-123';
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding-test' });
        await ThreadsTableTestHelper.addThread({ id: threadId, body: 'sebuah thread', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({
          id: 'comment-123',
          content: 'sebuah komentar',
          thread: threadId,
          owner: 'user-123',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123',
          comment_id: 'comment-123',
          content: 'balasan',
          owner: 'user-123',
          is_delete: false,
        });

        // Action
        const replies = await commentRepositoryPostgres.getRepliesComment(threadId);

        // Assert
        expect(replies).toHaveLength(1);
        expect(replies[0].id).toEqual('reply-123');
        expect(replies[0].content).toEqual('balasan');
        expect(replies[0].owner).toEqual('user-123');
        expect(replies[0].comment_id).toEqual('comment-123');
        expect(replies[0].is_deleted).toEqual(false);
        expect(replies[0].created_at).toBeDefined();
        expect(replies[0].updated_at).toBeDefined();
        expect(replies[0].username).toEqual('dicoding-test');
      });
    });

    describe('deleteComment', () => {
      it('should delete comment from database', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123999999', username: 'dicoding-test' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123456789', body: 'sebuah thread', owner: 'user-123999999' });
        await CommentsTableTestHelper.addComment({
          id: 'comment_THR_1234567810',
          content: 'sebuah komentar',
          thread: 'thread-123456789',
          owner: 'user-123999999',
        });

        // Action
        await commentRepositoryPostgres.deleteComment('comment_THR_1234567810');

        // Assert
        const comment = await CommentsTableTestHelper.checkIsDeletedCommentsById('comment_THR_1234567810');
        expect(comment).toEqual(true);

        // Verify is_deleted field
        const deletedComment = await CommentsTableTestHelper.findCommentsById('comment_THR_1234567810');
        expect(deletedComment.is_deleted).toEqual(true);
      });
    });

    describe('getCommentsThread', () => {
      it('should get comments of thread', async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-12345678910', username: 'dicoding-test' };
        const threadPayload = {
          id: 'thread-12345678X1',
          title: 'sebuah judul thread',
          body: 'sebuah thread',
          owner: 'user-12345678910',
        };
        const commentPayload = {
          id: 'comment_THR_1234567811',
          content: 'sebuah komentar',
          thread: threadPayload.id,
          owner: userPayload.id,
        };

        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment(commentPayload);

        const comments = await commentRepositoryPostgres.getCommentsThread(threadPayload.id);

        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toBeDefined();
        expect(comments[0].id).toEqual(commentPayload.id);
        expect(comments[0].username).toEqual(userPayload.username);
        expect(comments[0].content).toEqual('sebuah komentar');
        expect(comments[0].date).toBeDefined();
        expect(comments[0].is_deleted).toEqual(false);
      });
    });
  });
});
