/* eslint-disable max-len */
const DeleteReplyUseCase = require('../deleteReplyUsecase');
const DeleteReply = require('../../../Domains/comments/entities/deleteReplysComments');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const mockCommentRepository = {
      checkAvailabilityReply: jest.fn(() => Promise.resolve()),
      verifyReplyOwner: jest.fn(() => Promise.resolve()),
      deleteReply: jest.fn(() => Promise.resolve()),
    };

    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const expectedDeleteReply = new DeleteReply(useCasePayload);

    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkAvailabilityReply).toBeCalledWith(expectedDeleteReply.replyId);
    expect(mockCommentRepository.verifyReplyOwner).toBeCalledWith(expectedDeleteReply.replyId, expectedDeleteReply.owner);
    expect(mockCommentRepository.deleteReply).toBeCalledWith(expectedDeleteReply.replyId);
  });
});
