const AddCommentUseCase = require('../../../../Applications/use_case/addCommentUsecase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/deleteCommentUsecase');
const AddReplyUseCase = require('../../../../Applications/use_case/replyCommentsUsecase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/deleteReplyUsecase');

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;
    const useCasePayload = {
      content: request.payload.content,
      thread,
      owner,
    };
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    return h
      .response({
        status: 'success',
        data: {
          addedComment,
        },
      })
      .code(201);
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;
    const comment = request.params.commentId;
    const useCasePayload = {
      thread,
      comment,
      owner,
    };
    await deleteCommentUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
    });
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const comment = request.params.commentId;
    const useCasePayload = {
      content: request.payload.content,
      comment,
      owner,
    };
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    return h
      .response({
        status: 'success',
        data: {
          addedReply,
        },
      })
      .code(201);
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const reply = request.params.replyId;
    const useCasePayload = {
      reply,
      owner,
    };
    await deleteReplyUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentHandler;
