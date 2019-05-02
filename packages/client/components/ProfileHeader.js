import React, { useContext } from 'react';
import Avatar from 'components/Avatar';
import ProfileHeaderStats from 'components/ProfileHeaderStats';
import Button from 'components/Button';
import FollowButton from 'components/FollowButton';
import { LoggedInContext } from 'components/LoggedInUserProvider';

const ProfileHeader = ({ user }) => {
  const loggedInUser = useContext(LoggedInContext);

  const actionButton =
    loggedInUser && user.id === loggedInUser.id ? (
      <div className="action-btn">
        <Button gray narrow disabled>
          Edit Profile
        </Button>
      </div>
    ) : (
      <div className="action-btn">
        <FollowButton targetUser={user} />
      </div>
    );

  return (
    <div className="profile-header">
      <div className="cover" />
      <div className="header-bar">
        <div className="container">
          <div className="main-left">
            <Avatar src={user.avatarSourceUrl} size="very-big" withBorder />
          </div>

          <div className="stats">
            <ProfileHeaderStats
              tweets={user.tweetsCount}
              following={user.followingCount}
              followers={user.followersCount}
              likes={14}
            />
            {actionButton}
          </div>

          <div className="main-right">{actionButton}</div>
        </div>
      </div>

      <style jsx>{`
        .cover {
          width: 100%;
          height: 280px;
          background-color: tomato;
        }

        .header-bar {
          height: 60px;
          display: flex;
          background: #fff;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.35);
        }

        .container {
          padding: 0 32px;
          display: flex;
        }

        .main-left {
          position: relative;
        }

        .main-left :global(.avatar) {
          position: absolute;
          bottom: -30px;
        }

        .main-left,
        .main-right {
          width: 290px;
          padding: 0 8px;
        }

        .stats {
          flex: 1 1 auto;
          display: flex;
          justify-content: space-between;
        }

        .stats :global(.action-btn),
        .main-right :global(.action-btn) {
          display: flex;
          align-items: center;
        }

        .stats :global(.action-btn) {
          display: none;
        }

        .main-right {
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 1087px) {
          .container {
            width: 100%;
          }
        }

        @media (max-width: 1280px) {
          .main-right {
            display: none;
          }

          .stats :global(.action-btn) {
            display: flex;
          }

          .stats {
            padding-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileHeader;
