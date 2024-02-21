/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable no-undef */
const AddComment = require('../../../Domains/comments/entities/addComments');
const AddedComment = require('../../../Domains/comments/entities/addedComments');
const CommentRepository = require('../../../Domains/comments/commentRepo');
const ThreadRepository = require('../../../Domains/threads/threadRepo');
const AddCommentUseCase = require('../addCommentUsecase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah komentar',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn().mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        owner: useCasePayload.owner,
      })
    );
  });
});
