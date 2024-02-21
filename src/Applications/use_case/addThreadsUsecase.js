const AddThreads = require('../../Domains/threads/entities/addThreads');

class AddThreadsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addThreads = new AddThreads(useCasePayload);
    return this._threadRepository.addThread(addThreads);
  }
}

module.exports = AddThreadsUseCase;
