const DeleteReply = require('../../Domains/comments/entities/deleteReplysComments');

class DeleteReplyUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._commentRepository.checkAvailabilityReply(deleteReply.replyId);
    await this._commentRepository.verifyReplyOwner(deleteReply.replyId, deleteReply.owner);
    return this._commentRepository.deleteReply(deleteReply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
