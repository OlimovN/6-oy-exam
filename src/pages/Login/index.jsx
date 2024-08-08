import React, { useRef, useState, useEffect } from "react";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import manzara from "../../assets/img/dengiz.jpg";

function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [avatarURL, setAvatarURL] = useState("");

  useEffect(() => {
    const savedAvatarURL = localStorage.getItem("avatarURL");
    if (savedAvatarURL) {
      setAvatarURL(savedAvatarURL);
    }
  }, []);

  function validate(email, password) {
    const errors = {};
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

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleClick(event) {
    event.preventDefault();
    const isValid = validate(emailRef, passwordRef);
    if (!isValid) return;

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          navigate("/home");  
        } else {
          setErrors({ general: "Invalid credentials. Please try again." });
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors({ general: "An error occurred. Please try again later." });
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.imageContainer}>
          <img src={manzara} alt="manzara" />
        </div>
        <form className={styles.form}>
          <div className={styles.avatarContainer}>
            {avatarURL && (
              <img src={avatarURL} alt="Avatar" className={styles.avatar} />
            )}
          </div>
          <h3 className={styles.nice}>Nice to see you again</h3>
          {errors.general && <p className={styles.error}>{errors.general}</p>}
          <div className={styles.inputGroup}>
            <label>Login:</label>
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
          <div className={styles.rememberMeContainer}>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </a>
          </div>
          <button type="submit" onClick={handleClick}>
            Sign in
          </button>
          <button className={styles.googleButton}>
            <i className="fa-brands fa-google"></i>
            Or sign in with Google
          </button>
          <div className={styles.footer}>
            <p>
              Don’t have an account? <a href="/">Register here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
