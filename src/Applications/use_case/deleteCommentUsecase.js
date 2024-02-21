class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread, comment, owner } = useCasePayload;
    await this._commentRepository.checkAvailabilityComment(comment);
    await this._commentRepository.verifyCommentOwner(comment, owner);
    return this._commentRepository.deleteComment(comment);
  }
}

module.exports = DeleteCommentUseCase;
