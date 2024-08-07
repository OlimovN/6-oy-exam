import React, { useRef, useState } from "react";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [avatarURL, setAvatarURL] = useState("");

  function validate(username, email, password, confirmPassword) {
    const errors = {};

    const usernameValue = username.current.value.trim();
    if (!usernameValue) {
      errors.username = "Username is required.";
    }

    const emailValue = email.current.value.trim();
    if (!emailValue) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      errors.email = "Invalid email format.";
    }

    const passwordValue = password.current.value;
    if (!passwordValue) {
      errors.password = "Password is required.";
    }

    const confirmPasswordValue = confirmPassword.current.value;
    if (passwordValue !== confirmPasswordValue) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAvatarChange(event) {
    const url = event.target.value;
    if (url) {
      setAvatarURL(url);
    }
  }

  function handleClick(event) {
    event.preventDefault();
    const isValid = validate(
      usernameRef,
      emailRef,
      passwordRef,
      confirmPasswordRef
    );
    if (!isValid) return;

    const user = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      avatar: avatarURL,
    };

    fetch("https://api.escuelajs.co/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          localStorage.setItem("avatarURL", avatarURL); // Save avatar URL to local storage
          navigate("/login");
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <h3>Create Your Account</h3>
          {errors.general && <p className={styles.error}>{errors.general}</p>}
          <div className={styles.inputGroup}>
            <label>Username:</label>
            <input
              placeholder="Enter your username"
              type="text"
              ref={usernameRef}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label>Email:</label>
            <input placeholder="Enter your email" type="email" ref={emailRef} />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label>Password:</label>
            <input
              placeholder="Enter your password"
              type="password"
              ref={passwordRef}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label>Confirm Password:</label>
            <input
              placeholder="Confirm your password"
              type="password"
              ref={confirmPasswordRef}
            />
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label>Avatar URL:</label>
            <input
              type="text"
              placeholder="Enter avatar URL"
              onChange={handleAvatarChange}
              className={styles.urlInput}
            />
            <div className={styles.avatarContainer}>
              {avatarURL && (
                <img
                  src={avatarURL}
                  alt="Avatar Preview"
                  className={styles.avatarPreview}
                />
              )}
            </div>
          </div>
          <div className={styles.rememberMeContainer}>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            onClick={handleClick}
            className={styles.submitButton}
          >
            Register
          </button>
          <div className={styles.socialLogin}>
            <button className={styles.googleButton}>
              <img src="/path-to-google-icon.png" alt="Google" />
              Or sign up with Google
            </button>
          </div>
          <div className={styles.footer}>
            <p>
              Already have an account? <a href="/login">Login here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
