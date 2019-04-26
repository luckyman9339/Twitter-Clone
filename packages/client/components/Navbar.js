import React from 'react';
import Link from 'next/link';
import colors from '../lib/colors';
import Icon from './Icon';
import UnderlineButton from './UnderlineButton';
import Search from './Search';
import NavbarMenu from './NavbarMenu';

const NavButton = ({ text, icon, iconSelected, selected, ...props }) => (
  <UnderlineButton className="nav-button" selected={selected} {...props}>
    <div className="icon">
      <Icon
        name={selected && iconSelected ? iconSelected : icon}
        size="1.4em"
      />
    </div>
    {text}

    <style jsx>{`
      :global(.nav-button) {
        cursor: pointer;
      }
      :global(.nav-button.selected) .icon :global(i),
      :global(.nav-button:hover) .icon :global(i),
      :global(.nav-button:focus) .icon :global(i) {
        color: ${colors.twitterBlue};
      }
      .icon {
        width: 23px;
        height: 23px;
        margin-top: -2px;
        margin-right: 6px;
      }
      .icon :global(.Icon.Icon--home),
      .icon :global(.Icon.Icon--homeFilled) {
        margin-top: -2px;
      }
    `}</style>
  </UnderlineButton>
);

const Navbar = ({ currentPage, user }) => (
  <div className="app-navbar">
    <div className="container">
      <div className="bird">
        <Icon name="bird" color={colors.twitterBlue} size="1.28em" />
      </div>
      <div className="left">
        <Link href="/">
          <NavButton
            text="Home"
            icon="home"
            iconSelected="homeFilled"
            selected={currentPage === 'home'}
          />
        </Link>
        <NavButton
          text="Project on Github"
          icon="promoteMode"
          href="https://github.com/rafaelalmeidatk"
          as="a"
        />
      </div>
      <div className="right">
        <Search />
        <NavbarMenu user={user} />
      </div>
    </div>

    <style jsx>{`
      .app-navbar {
        position: fixed;
        top: 0;
        z-index: 999;
        width: 100%;
        height: 46px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.45);
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bird {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .bird i {
        color: ${colors.twitterBlue};
        font-size: 1.28em;
      }

      .left {
        height: 100%;
        display: flex;
      }

      .right {
        display: flex;
        align-items: center;
      }
    `}</style>
  </div>
);

export default Navbar;
