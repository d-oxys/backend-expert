const AddReply = require('../../Domains/comments/entities/replyComments');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { comment } = useCasePayload;
    await this._commentRepository.checkAvailabilityComment(comment);
    const newReply = new AddReply(useCasePayload);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
