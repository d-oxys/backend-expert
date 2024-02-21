```
starter
├─ .eslintrc.js
├─ .gitignore
├─ config
│  └─ database
├─ migrations
├─ package.json
├─ README.md
├─ src
│  ├─ app.js
│  ├─ Applications
│  │  ├─ security
│  │  │  ├─ AuthenticationTokenManager.js
│  │  │  ├─ PasswordHash.js
│  │  │  └─ _test
│  │  │     ├─ AuthenticationTokenManager.test.js
│  │  │     └─ PasswordHash.test.js
│  │  └─ use_case
│  │     ├─ addCommentUsecase.js
│  │     ├─ addThreadsUsecase.js
│  │     ├─ AddUserUseCase.js
│  │     ├─ DeleteAuthenticationUseCase.js
│  │     ├─ deleteCommentUsecase.js
│  │     ├─ deleteReplyUsecase.js
│  │     ├─ LoginUserUseCase.js
│  │     ├─ LogoutUserUseCase.js
│  │     ├─ RefreshAuthenticationUseCase.js
│  │     ├─ replyCommentsUsecase.js
│  │     └─ _test
│  │        ├─ addCommentUsecase.test.js
│  │        ├─ addReplyUsecase.test.js
│  │        ├─ addThreadsUsecase.test.js
│  │        ├─ AddUserUseCase.test.js
│  │        ├─ DeleteAuthenticationUseCase.test.js
│  │        ├─ deleteCommentUsecase.test.js
│  │        ├─ LoginUserUseCase.test.js
│  │        ├─ LogoutUserUseCase.test.js
│  │        └─ RefreshAuthenticationUseCase.test.js
│  ├─ Commons
│  │  └─ exceptions
│  │     ├─ AuthenticationError.js
│  │     ├─ AuthorizationError.js
│  │     ├─ ClientError.js
│  │     ├─ DomainErrorTranslator.js
│  │     ├─ InvariantError.js
│  │     ├─ NotFoundError.js
│  │     └─ _test
│  │        ├─ AuthenticationError.test.js
│  │        ├─ AuthorizationError.test.js
│  │        ├─ ClientError.test.js
│  │        ├─ DomainErrorTranslator.test.js
│  │        ├─ InvariantError.test.js
│  │        └─ NotFoundError.test.js
│  ├─ Domains
│  │  ├─ authentications
│  │  │  ├─ AuthenticationRepository.js
│  │  │  ├─ entities
│  │  │  │  ├─ NewAuth.js
│  │  │  │  └─ _test
│  │  │  │     └─ NewAuth.test.js
│  │  │  └─ _test
│  │  │     └─ AuthenticationRepository.test.js
│  │  ├─ comments
│  │  │  ├─ commentRepo.js
│  │  │  ├─ entities
│  │  │  │  ├─ addComments.js
│  │  │  │  ├─ addedComments.js
│  │  │  │  ├─ addedReplys.js
│  │  │  │  ├─ replyComments.js
│  │  │  │  └─ _test
│  │  │  │     ├─ addComments.test.js
│  │  │  │     ├─ addedComments.test.js
│  │  │  │     ├─ addedReplys.test.js
│  │  │  │     └─ replyComments.test.js
│  │  │  └─ _test
│  │  │     └─ commentRepository.test.js
│  │  ├─ threads
│  │  │  ├─ entities
│  │  │  │  ├─ addedThreads.js
│  │  │  │  ├─ addThreads.js
│  │  │  │  └─ _test
│  │  │  │     ├─ addedThreads.test.js
│  │  │  │     └─ addThreads.test.js
│  │  │  ├─ threadRepo.js
│  │  │  └─ _test
│  │  │     └─ ThreadRepository.test.js
│  │  └─ users
│  │     ├─ entities
│  │     │  ├─ RegisteredUser.js
│  │     │  ├─ RegisterUser.js
│  │     │  ├─ UserLogin.js
│  │     │  └─ _test
│  │     │     ├─ RegisteredUser.test.js
│  │     │     ├─ RegisterUser.test.js
│  │     │     └─ UserLogin.test.js
│  │     ├─ UserRepository.js
│  │     └─ _test
│  │        └─ UserRepository.test.js
│  ├─ Infrastructures
│  │  ├─ container.js
│  │  ├─ database
│  │  │  └─ postgres
│  │  │     └─ pool.js
│  │  ├─ http
│  │  │  ├─ createServer.js
│  │  │  └─ _test
│  │  │     ├─ authentications.test.js
│  │  │     ├─ createServer.test.js
│  │  │     └─ users.test.js
│  │  ├─ repository
│  │  │  ├─ AuthenticationRepositoryPostgres.js
│  │  │  ├─ CommentRepositoryPostgres.js
│  │  │  ├─ ThreadRepositoryPostgres.js
│  │  │  ├─ UserRepositoryPostgres.js
│  │  │  └─ _test
│  │  │     ├─ AuthenticationRepositoryPostgres.test.js
│  │  │     ├─ CommentRepositoryPostgres.test.js
│  │  │     ├─ ThreadRepositoryPostgres.test.js
│  │  │     └─ UserRepositoryPostgres.test.js
│  │  └─ security
│  │     ├─ BcryptPasswordHash.js
│  │     ├─ JwtTokenManager.js
│  │     └─ _test
│  │        ├─ BcryptPasswordHash.test.js
│  │        └─ JwtTokenManager.test.js
│  └─ Interfaces
│     └─ http
│        └─ api
│           ├─ authentications
│           ├─ comments
│           ├─ threads
│           └─ users
└─ tests
```
