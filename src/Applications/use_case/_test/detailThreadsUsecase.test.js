/* eslint-disable max-len */
const CommentRepository = require('../../../Domains/comments/commentRepo');
const ThreadRepository = require('../../../Domains/threads/threadRepo');
const DetailThreadUseCase = require('../detailThreadsUsecase');

describe('DetailThreadUseCase', () => {
  it('should get return detail thread correctly', async () => {
    const useCasePayload = {
      thread: 'thread-THR-123',
    };

    const expectedThread = {
      id: 'thread-THR-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2024-02-20 07.00',
      username: 'dicoding-test',
    };

    const expectedComment = [
      {
        id: 'comment-123',
        username: 'dicoding-test',
        date: '2024-02-20 07.00',
        content: 'sebuah comment',
        is_deleted: 0,
      },
      {
        id: 'comment-123',
        username: 'dicoding-test',
        date: '2024-02-20 07.00',
        content: 'sebuah comment',
        is_deleted: 1,
      },
    ];

    const mockThread = {
      id: 'thread-THR-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2024-02-20 07.00',
      username: 'dicoding-test',
    };

    const mockComment = [
      {
        id: 'comment-123',
        username: 'dicoding-test',
        date: '2024-02-20 07.00',
        content: 'sebuah comment',
        is_deleted: 0,
      },
      {
        id: 'comment-123',
        username: 'dicoding-test',
        date: '2024-02-20 07.00',
        content: 'sebuah comment',
        is_deleted: 1,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsThread = jest.fn().mockImplementation(() => Promise.resolve(mockComment));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(useCasePayload.thread);
    expect(detailThread).toStrictEqual({
      thread: {
        id: 'thread-THR-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2024-02-20 07.00',
        username: 'dicoding-test',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding-test',
            date: '2024-02-20 07.00',
            content: 'sebuah comment',
          },
          {
            id: 'comment-123',
            username: 'dicoding-test',
            date: '2024-02-20 07.00',
            content: '**komentar telah dihapus**',
          },
        ],
      },
    });
  });
});
