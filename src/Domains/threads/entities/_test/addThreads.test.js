const AddThread = require('../addThreads');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'test',
      owner: 'Dicoding-Test',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: true,
      owner: 'Dicoding-Test',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 250 character', () => {
    const payload = {
      title: 'Pellentesque etiam blandit in tincidunt at donec. Eget ipsum dignissim placerat nisi, adipiscing mauris non. Purus parturient viverra nunc, tortor sit laoreet. Quam tincidunt aliquam adipiscing tempor.',
      body: 'Dicoding Indonesia',
      owner: 'Dicoding-Test',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create new thread object correctly', () => {
    const payload = {
      title: 'Dicoding Test',
      body: 'Dicoding Indonesia',
      owner: 'Dicoding-Test',
    };

    const { title, body, owner } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
