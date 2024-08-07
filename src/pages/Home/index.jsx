import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

function Home() {
  const [user, setUser] = useState({});
  const [isGreetingVisible, setIsGreetingVisible] = useState(true);
  const [carDetails, setCarDetails] = useState({
    year: "",
    price: "",
    model: "",
    image: "",
  });
  const [carList, setCarList] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedCars = localStorage.getItem("carList");
    if (storedCars) {
      setCarList(JSON.parse(storedCars));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGreetingVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("carList", JSON.stringify(carList));
  }, [carList]);

  const validate = () => {
    const newErrors = {};
    if (!carDetails.year) newErrors.year = "Car year is required";
    if (!carDetails.price) newErrors.price = "Car price is required";
    if (!carDetails.model) newErrors.model = "Car model is required";
    if (!carDetails.image) {
      newErrors.image = "Image URL is required";
    } else if (!/^https?:\/\/.*/i.test(carDetails.image)) {
      newErrors.image =
        "Valid image URL is required (must start with http:// or https://)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  const handleAddCar = () => {
    if (!validate()) return;
    setCarList([...carList, carDetails]);
    setCarDetails({ year: "", price: "", model: "", image: "" });
  };

  const handleDeleteCar = (index) => {
    const newCarList = carList.filter((_, i) => i !== index);
    setCarList(newCarList);
  };

  return (
    <div className={styles.container}>
      {isGreetingVisible ? (
        <div className={styles.greeting}>
          <h1 className={styles.greetingText}>
            Welcome back, {user.username}!
          </h1>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.form}>
            <input
              type="text"
              name="year"
              placeholder="Car Year"
              value={carDetails.year}
              onChange={handleChange}
              className={`${styles.input} ${errors.year ? styles.error : ""}`}
            />
            {errors.year && <p className={styles.errorText}>{errors.year}</p>}

            <input
              type="text"
              name="price"
              placeholder="Car Price"
              value={carDetails.price}
              onChange={handleChange}
              className={`${styles.input} ${errors.price ? styles.error : ""}`}
            />
            {errors.price && <p className={styles.errorText}>{errors.price}</p>}

            <input
              type="text"
              name="model"
              placeholder="Car Model"
              value={carDetails.model}
              onChange={handleChange}
              className={`${styles.input} ${errors.model ? styles.error : ""}`}
            />
            {errors.model && <p className={styles.errorText}>{errors.model}</p>}

            <input
              type="text"
              name="image"
              placeholder="Car Image URL"
              value={carDetails.image}
              onChange={handleChange}
              className={`${styles.input} ${errors.image ? styles.error : ""}`}
            />
            {errors.image && <p className={styles.errorText}>{errors.image}</p>}

            <button onClick={handleAddCar} className={styles.button}>
              Add Car
            </button>
          </div>
        </div>
      )}
      <div className={styles.cardContainer}>
        {carList.map((car, index) => (
          <div key={index} className={styles.card}>
            <img src={car.image} alt={car.model} className={styles.cardImage} />
            <div className={styles.cardInfo}>
              <h2>{car.model}</h2>
              <p>Year: {car.year}</p>
              <p>Price: {car.price}</p>
              <button
                onClick={() => handleDeleteCar(index)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
