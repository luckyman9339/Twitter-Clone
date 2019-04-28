import React from 'react';
import colors from '../../lib/colors';
import FollowButton from 'components/FollowButton';
import Avatar from 'components/Avatar';
import { TweetFooter } from 'components/Tweet';

const MainTweet = ({ tweet }) => (
  <div className="tweet-area">
    <div className="header">
      <Avatar size="medium" />
      <div className="user-data">
        <div className="name">{tweet.user.name}</div>
        <div className="username">@{tweet.user.username}</div>
      </div>
      <FollowButton targetUser={tweet.user} />
    </div>

    <div className="body">{tweet.content}</div>

    {tweet.retweetCount || tweet.likeCount ? (
      <div className="stats">
        {tweet.retweetCount ? (
          <div className="stat">
            <strong>{tweet.retweetCount}</strong> Retweets
          </div>
        ) : null}

        {tweet.likeCount ? (
          <div className="stat">
            <strong>{tweet.likeCount}</strong> Likes
          </div>
        ) : null}
      </div>
    ) : null}

    <TweetFooter
      replyCount={tweet.replyCount}
      retweetCount={tweet.retweetCount}
      likeCount={tweet.likeCount}
    />

    <style jsx>{`
      .tweet-area {
        padding: 30px 40px;
      }

      .header {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }

      .user-data {
        margin-left: 10px;
        flex: 1 1 auto;
      }

      .name {
        margin-top: -2px;
        margin-bottom: 6px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 1.2em;
        line-height: 1em;
        font-weight: bold;
      }

      .username {
        line-height: 1em;
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.7);
      }

      .body {
        cursor: default;
        font-size: 1.6em;
        line-height: 1.3em;
        letter-spacing: 0.01em;
        color: rgba(0, 0, 0, 0.85);
      }

      .stats {
        margin-top: 10px;
        padding: 12px 0;
        display: flex;
        border-top: 1px solid ${colors.boxBorder};
        border-bottom: 1px solid ${colors.boxBorder};
      }

      .stat {
        margin-right: 10px;
        color: ${colors.blueGray};
        font-size: 0.87em;
      }

      .tweet-area :global(.tweet-footer) {
        margin-top: 13px;
      }
    `}</style>
  </div>
);

export default MainTweet;
