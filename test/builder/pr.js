import IDSequence from './id-sequence';

class CommentBuilder {
  constructor() {
    this._id = 0;
    this._path = 'first.txt';
    this._position = 0;
    this._authorLogin = 'someone';
    this._authorAvatarUrl = 'https://avatars3.githubusercontent.com/u/17565?s=32&v=4';
    this._url = 'https://github.com/atom/github/pull/1829/files#r242224689';
    this._createdAt = '2018-12-27T17:51:17Z';
    this._body = 'Lorem ipsum dolor sit amet, te urbanitas appellantur est.';
    this._replyTo = null;
    this._isMinimized = false;
  }

  id(i) {
    this._id = i;
    return this;
  }

  minimized(m) {
    this._isMinimized = m;
    return this;
  }

  path(p) {
    this._path = p;
    return this;
  }

  position(pos) {
    this._position = pos;
    return this;
  }

  authorLogin(login) {
    this._authorLogin = login;
    return this;
  }

  authorAvatarUrl(url) {
    this._authorAvatarUrl = url;
    return this;
  }

  url(u) {
    this._url = u;
    return this;
  }

  createdAt(ts) {
    this._createdAt = ts;
    return this;
  }

  body(text) {
    this._body = text;
    return this;
  }

  replyTo(replyToId) {
    this._replyTo = {id: replyToId};
    return this;
  }

  build() {
    return {
      id: this._id,
      author: {
        login: this._authorLogin,
        avatarUrl: this._authorAvatarUrl,
      },
      body: this._body,
      path: this._path,
      position: this._position,
      createdAt: this._createdAt,
      url: this._url,
      replyTo: this._replyTo,
      isMinimized: this._isMinimized,
    };
  }
}

class ReviewThreadBuilder {
  constructor(commentIDs = new IDSequence()) {
    this._isResolved = false;
    this._comments = [];

    this.commentIDs = commentIDs;
  }

  resolved() {
    this._isResolved = true;
    return this;
  }

  addComment(block = () => {}) {
    const builder = new CommentBuilder();
    builder.id(this.commentIDs.nextID());

    block(builder);

    this._comments.push(builder.build());

    return this;
  }

  build() {
    return {
      isResolved: this._isResolved,
      comments: {edges: this._comments.map(comment => ({node: comment}))},
    };
  }
}

class ReviewBuilder {
  constructor(commentIDs = new IDSequence()) {
    this.commentIDs = commentIDs;
    this._id = 0;
    this._comments = [];
    this._submittedAt = '2018-12-28T20:40:55Z';
  }

  id(i) {
    this._id = i;
    return this;
  }

  submittedAt(timestamp) {
    this._submittedAt = timestamp;
    return this;
  }

  addComment(block = () => {}) {
    const builder = new CommentBuilder();
    builder.id(this.commentIDs.nextID());

    block(builder);
    this._comments.push(builder.build());

    return this;
  }

  build() {
    const comments = this._comments.map(comment => {
      return {node: comment};
    });
    return {
      id: this._id,
      submittedAt: this._submittedAt,
      comments: {edges: comments},
    };
  }
}

class PullRequestBuilder {
  constructor() {
    this.commentIDs = new IDSequence();
    this.reviewIDs = new IDSequence();
    this._reviews = [];
    this._reviewThreads = [];
  }

  addReview(block = () => {}) {
    const builder = new ReviewBuilder(this.commentIDs);
    builder.id(this.reviewIDs.nextID());

    block(builder);
    this._reviews.push(builder.build());
    return this;
  }

  addReviewThread(block = () => {}) {
    const builder = new ReviewThreadBuilder(this.commentIDs);
    block(builder);
    this._reviewThreads.push(builder.build());
    return this;
  }

  build() {
    return {
      reviews: {edges: this._reviews.map(r => ({node: r}))},
      reviewThreads: {edges: this._reviewThreads.map(t => ({node: t}))},
    };
  }
}

export function reviewBuilder() {
  return new ReviewBuilder();
}

export function reviewThreadBuilder() {
  return new ReviewThreadBuilder();
}

export function pullRequestBuilder() {
  return new PullRequestBuilder();
}
