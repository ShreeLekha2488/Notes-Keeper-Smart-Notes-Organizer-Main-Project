import "./AuthLayout.css";

const AuthLayout = ({
  title,
  subtitle,
  children,
  image,
}) => {
  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-left">

        <div className="auth-overlay">
          <h1>Notes Keeper</h1>

          <p>
            Organize your thoughts,
            manage your notes,
            and stay productive from anywhere.
          </p>

          {image && (
            <img
              src={image}
              alt="Authentication"
              className="auth-image"
            />
          )}
        </div>

      </div>

      {/* Right Side */}
      <div className="auth-right">

        <div className="auth-card">

          <h2>{title}</h2>

          <p className="subtitle">
            {subtitle}
          </p>

          {children}

        </div>

      </div>
    </div>
  );
};

export default AuthLayout;