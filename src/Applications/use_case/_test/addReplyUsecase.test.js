/* eslint-disable max-len */
const AddReplyUseCase = require('../replyCommentsUsecase');
const CommentRepository = require('../../../Domains/comments/commentRepo');
const AddReply = require('../../../Domains/comments/entities/replyComments');
const AddedReply = require('../../../Domains/comments/entities/addedReplys');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const mockReplyRepository = new CommentRepository();
    const mockCommentRepository = new CommentRepository();
    const useCasePayload = {
      comment: 'comment-id',
      content: 'reply-content',
      owner: 'user-id',
    };
    const mockAddedReply = new AddedReply({
      id: 'reply-id',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });
    mockCommentRepository.checkAvailabilityComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReplyId = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReplyId).toEqual(mockAddedReply);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply(useCasePayload));
  });
});
