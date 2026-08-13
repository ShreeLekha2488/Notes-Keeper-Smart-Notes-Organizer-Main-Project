import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./PasswordInput.css";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-group">
      <label className="password-label">
        {label}
        {required && (
          <span className="required">*</span>
        )}
      </label>

      <div className="password-wrapper">
        <input
          className={`password-input ${
            error ? "password-error" : ""
          }`}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
        />

        <button
          type="button"
          className="toggle-password"
          onClick={() =>
            setShowPassword(!showPassword)
          }
        >
          {showPassword ? (
            <FiEyeOff />
          ) : (
            <FiEye />
          )}
        </button>
      </div>

      {error && (
        <p className="password-error-text">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;