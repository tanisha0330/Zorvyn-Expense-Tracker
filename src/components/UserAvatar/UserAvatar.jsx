import './UserAvatar.css';

function UserAvatar() {
  const user = {
    name: 'Mark Johnson',
    greeting: 'Welcome Back,',
    // Using a placeholder initials avatar styled via CSS
    initials: 'MJ',
  };

  return (
    <div className="user-avatar-section">
      <div className="avatar-wrapper">
        <div className="avatar-img">
          <span className="avatar-initials">{user.initials}</span>
        </div>
      </div>
      <p className="user-greeting">{user.greeting}</p>
      <h3 className="user-name">{user.name}</h3>
    </div>
  );
}

export default UserAvatar;
