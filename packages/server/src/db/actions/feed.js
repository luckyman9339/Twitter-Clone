import knex from '../knex';
import { getUserFollowingIds } from './user';

const decodeCursor = cursor => {
  const content = new Buffer(cursor, 'base64').toString('binary');
  const [after, order] = content.split(';');
  return { after: new Date(after), order };
};

const encodeCursor = ({ after, order }) => {
  const input = [new Date(after).toISOString(), order].join(';');
  return Buffer.from(input).toString('base64');
};

const buildQuery = ({ idCollection, order, after, first }) => {
  return knex('tweets')
    .select(
      knex.raw(`
      "tweets"."id" as "tweetId",
      "tweets"."content" as "tweetContent",
      "tweets"."userId" as "tweetUserId",
      "tweets"."created_at" as "created_at",
      NULL::uuid as "retweetId",
      NULL::uuid as "retweetUserId",
      NULL::uuid as "likeId",
      NULL::uuid as "likeUserId",
      'tweet' as kind
    `)
    )
    .whereIn('userId', idCollection)
    .andWhere(function() {
      if (after) {
        this.where('tweets.created_at', '<', after);
      }
    })
    .unionAll(function() {
      this.select(
        knex.raw(`
        "tweets"."id" as "tweetId",
        "tweets"."content" as "tweetContent",
        "tweets"."userId" as "tweetUserId",
        "retweets"."created_at" as "created_at",
        "retweets"."id" as "retweetId",
        "retweets"."userId" as "retweetUserId",
        NULL::uuid as "likeId",
        NULL::uuid as "likeUserId",
        'retweet' as kind
      `)
      )
        .from('retweets')
        .whereIn('retweets.userId', idCollection)
        .andWhere(function() {
          if (after) {
            this.where('retweets.created_at', '<', after);
          }
        })
        .leftJoin('tweets', 'retweets.tweetId', 'tweets.id');
    })
    .unionAll(function() {
      this.select(
        knex.raw(`
        "tweets"."id" as "tweetId",
        "tweets"."content" as "tweetContent",
        "tweets"."userId" as "tweetUserId",
        "likes"."created_at" as "created_at",
        NULL::uuid as "retweetId",
        NULL::uuid as "retweetUserId",
        "likes"."id" as "likeId",
        "likes"."userId" as "likeUserId",
        'like' as kind
      `)
      )
        .from('likes')
        .whereIn('likes.userId', idCollection)
        .andWhere(function() {
          if (after) {
            this.where('likes.created_at', '<', after);
          }
        })
        .leftJoin('tweets', 'likes.tweetId', 'tweets.id');
    })
    .orderBy('created_at', order)
    .limit(first);
};

export async function getFeedForUser(user, { first, after }) {
  // Get all the IDs from the users that the user is following
  const followingIds = await getUserFollowingIds(user);
  const allIds = [user.id, ...followingIds];
  const defaultOrder = 'desc'; // Sort from newest to oldest

  first = Math.min(first || 10, 100); // Default to 10 entries, max of 100
  const cursorData = after ? decodeCursor(after) : {};
  const order = cursorData.order || defaultOrder;

  const query = buildQuery({
    idCollection: allIds,
    order,
    after: cursorData.after,
    first,
  });
  const rows = await query;

  // console.log('rows', rows);

  return {
    edges: rows.map(row => {
      let node = null;

      if (row.kind === 'tweet') {
        node = {
          tweet: {
            id: row.tweetId,
            content: row.tweetContent,
            userId: row.tweetUserId,
            createdAt: row.created_at,
            kind: row.kind,
          },
        };
      }

      if (row.kind === 'retweet') {
        node = {
          retweet: {
            id: row.retweetId,
            userId: row.retweetUserId,
            kind: row.kind,
            tweet: {
              id: row.tweetId,
              content: row.tweetContent,
              userId: row.tweetUserId,
              createdAt: row.created_at,
              kind: row.kind,
            },
          },
        };
      }

      if (row.kind === 'like') {
        node = {
          like: {
            id: row.likeId,
            userId: row.likeUserId,
            kind: row.kind,
            tweet: {
              id: row.tweetId,
              content: row.tweetContent,
              userId: row.tweetUserId,
              createdAt: row.created_at,
              kind: row.kind,
            },
          },
        };
      }

      return {
        cursor: encodeCursor({ after: row.created_at, order }),
        node,
      };
    }),
    pageInfo: {
      async hasNextPage() {
        if (rows.length < first) {
          return false;
        }

        // Check if there is one more tweet after the last sent,
        // if so, we still have pages
        const lastRow = rows[rows.length - 1];

        const query = buildQuery({
          idCollection: allIds,
          order,
          after: lastRow.created_at,
          first: 1,
        });

        const afterRows = await query;
        return afterRows && !!afterRows[0];
      },
    },
  };
}
