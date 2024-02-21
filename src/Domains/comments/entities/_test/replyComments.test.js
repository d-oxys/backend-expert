const AddReply = require('../replyComments');

describe('AddReply', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-id',
      owner: 'user-id',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      comment: 'comment-id',
      owner: 'user-id',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new AddReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply-content',
      comment: 'comment-id',
      owner: 'user-id',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.comment).toEqual(payload.comment);
    expect(addReply.owner).toEqual(payload.owner);
  });
});
