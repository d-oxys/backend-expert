/* eslint-disable object-shorthand */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadRepository = require('../../../Domains/threads/threadRepo');
const ThreadsTableTestHelper = require('../../../../tests/threadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/addThreads');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/addedThreads');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('checkAvailabilityThread function', () => {
      it('should throw NotFoundError if thread not available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
        const threadId = 'thread-000';

        // Action & Assert
        await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).rejects.toThrow(NotFoundError);
      });

      it('should not throw NotFoundError if thread available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
        const userId = 'user-456';
        await UsersTableTestHelper.addUser({ id: userId });
        const threadId = 'thread-456';
        await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

        // Action & Assert
        await expect(threadRepositoryPostgres.checkAvailabilityThread(threadId)).resolves.not.toThrow(NotFoundError);
      });
    });

    describe('addThread function', () => {
      it('should persist new thread and return added thread correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-0lCObqAypcHNNrwBW3sms', username: 'test1' });

        const newThread = new AddThread({
          title: 'Dicoding Test',
          body: 'lorem ipsum dolor sit amet',
          owner: 'user-0lCObqAypcHNNrwBW3sms',
        });

        const fakeIdGenerator = () => 'THR-123456789threads';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        const thread = await ThreadsTableTestHelper.findThreadsById('thread-THR-123456789threads');
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-THR-123456789threads',
            title: 'Dicoding Test',
            owner: 'user-0lCObqAypcHNNrwBW3sms',
          })
        );
        expect(thread).toHaveLength(1);
      });
    });

    describe('getDetailThreadById function', () => {
      it('should throw NotFoundError if thread not available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
        const threadId = 'thread-000';

        // Action & Assert
        await expect(threadRepositoryPostgres.getDetailThread(threadId)).rejects.toThrow(NotFoundError);
      });

      it('should get detail thread correctly', async () => {
        // Arrange
        const threadRepository = new ThreadRepositoryPostgres(pool, {});
        const userPayload = { id: 'user-123', username: 'dicoding123' };
        const threadPayload = {
          id: 'thread-123',
          title: 'Example Title',
          body: 'Example Body',
          owner: userPayload.id,
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);

        // Action
        const threadResult = await threadRepository.getDetailThread(threadPayload.id);

        // Assert
        expect(threadResult).toBeDefined();
        expect(threadResult.id).toEqual(threadPayload.id);
        expect(threadResult.title).toEqual(threadPayload.title);
        expect(threadResult.body).toEqual(threadPayload.body);
        expect(threadResult.username).toEqual(userPayload.username);
      });
    });
  });
});
