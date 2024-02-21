/* eslint-disable max-len */
const DeleteCommentUseCase = require('../deleteCommentUsecase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const mockCommentRepository = {
      checkAvailabilityComment: jest.fn(() => Promise.resolve()),
      verifyCommentOwner: jest.fn(() => Promise.resolve()),
      deleteComment: jest.fn(() => Promise.resolve()),
    };

    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.comment);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.comment);
  });
});
