import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { gql } from 'apollo-boost';
import colors from '../../lib/colors';
import { getRelativeTweetTime } from '../../lib/time';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import Footer from './Footer';
import { LoggedInContext } from 'components/LoggedInUserProvider';

const CONTEXT_ACTION_ICONS = {
  RETWEET: 'retweeted',
  LIKE: 'heartBadge',
};

const CONTEXT_ACTION_TEXT = {
  RETWEET: 'Retweeted',
  LIKE: 'liked',
};

const Tweet = ({ tweet, refetch, context, onClick, noBorders, replyingTo }) => {
  const loggedInUser = useContext(LoggedInContext);
  const {
    id,
    content,
    replyCount,
    retweetCount,
    likeCount,
    retweeted,
    liked,
    createdAt,
  } = tweet;
  const { username, name, avatarSourceUrl } = tweet.user;
  const [time, setTime] = useState('...');

  useEffect(() => {
    // Set time only when in the client because the server doesn't know the
    // timezone of the client
    setTime(getRelativeTweetTime(createdAt));
  }, []);

  const loggedInUserIsContextAuthor =
    context && loggedInUser && context.user.id === loggedInUser.id;

  return (
    <div
      className={cx('tweet', { 'no-borders': noBorders })}
      onClick={() => onClick(id)}
    >
      {context && (
        <div className="context">
          <Icon name={CONTEXT_ACTION_ICONS[context.action]} size="14px" />
          <span>
            {loggedInUserIsContextAuthor ? 'You' : context.user.name}{' '}
            {CONTEXT_ACTION_TEXT[context.action]}
          </span>
        </div>
      )}

      <div className="tweet-content">
        <div className="left">
          <Avatar src={avatarSourceUrl} size="medium" />
        </div>

        <div className="body">
          <div className="meta" onClick={e => e.stopPropagation()}>
            <Link
              href={`/profile?username=${username}`}
              as={`/profile/${username}`}
              prefetch
            >
              <a>
                <span className="name">{name}</span>
                <span className="username">@{username}</span>
              </a>
            </Link>
            <span className="time">{time}</span>
          </div>

          {replyingTo && (
            <div className="replying-to">
              Replying to <a>@{replyingTo}</a>
            </div>
          )}

          <div className="text-content">{content}</div>

          <Footer
            tweetId={id}
            replyCount={replyCount}
            retweetCount={retweetCount}
            likeCount={likeCount}
            retweeted={retweeted}
            liked={liked}
            refetch={refetch}
          />
        </div>
      </div>
      <style jsx>{`
        .tweet {
          padding: 9px 12px;
          cursor: pointer;
          background-color: #fff;
          border-left: 1px solid ${colors.boxBorder};
          border-right: 1px solid ${colors.boxBorder};
          border-bottom: 1px solid ${colors.boxBorder};
        }

        .tweet.no-borders {
          border: 0;
        }

        .tweet:hover {
          background-color: ${colors.gray};
        }

        .context {
          padding: 0 0 9px 56px;
          display: flex;
          align-items: center;
          font-size: 0.8em;
          line-height: 0.8em;
          color: ${colors.blueGray};
        }

        .context :global(i) {
          margin-left: -24px;
          margin-right: 6px;
          color: ${colors.blueGray};
        }

        .replying-to {
          margin: 4px 0;
          font-size: 0.87em;
          color: ${colors.blueGray};
        }

        .tweet-content {
          display: flex;
        }

        .body {
          padding-left: 8px;
        }

        .meta {
          line-height: 1em;
        }

        .meta a:hover .name {
          text-decoration: underline;
          color: ${colors.twitterBlue};
        }

        .name {
          font-weight: bold;
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.85);
        }

        .username {
          margin-left: 5px;
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.9em;
        }

        .time {
          margin-left: 5px;
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.86em;
        }

        .time:before {
          margin-right: 5px;
          content: '\\00b7';
          font-weight: bold;
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.5);
        }

        .text-content {
          margin: 2px 0 8px;
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.85);
        }
      `}</style>
    </div>
  );
};

Tweet.fragments = {
  tweet: gql`
    fragment TweetFields on Tweet {
      id
      content
      replyCount
      retweetCount
      likeCount
      retweeted
      liked
      createdAt
      user {
        id
        name
        username
        avatarSourceUrl
      }
    }
  `,
};

export default Tweet;
export { Footer as TweetFooter };
