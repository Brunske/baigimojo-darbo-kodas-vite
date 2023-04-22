import { useState } from "react";
import FormInput from "../../components/form/FormInput";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUpCss.scss";

function SignUpForm() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include a special character",
      label: "Username",
      pattern: `^[a-zA-Z0-9]{3,16}$`,
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Enter email",
      errorMessage: "It should be a valid email adress",
      label: "email",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Enter Password",
      errorMessage:
        "Password should be 8-20 characters and should include 1 letter, 1 number and 1 special character",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match",
      label: "confirm Password",
      pattern: values.password,
      required: true,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios({
      method: "POST",
      data: {
        username: values.username,
        email: values.email,
        password: values.password,
      },
      withCredentials: true,
      url: "http://localhost:5000/signup",
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        // If signup is successful, redirect to the login page
        toast.success("Sign up successful");
        window.location.href = "/login";
      } else if (
        res.status === 250 &&
        res.data.message === "Email and Username is in use"
      ) {
        setValues((e) => ({
          ...values,
          email: "",
          username: "",
        }));
        toast.error("Username and email are already in use");
      } else if (
        res.status === 251 &&
        res.data.message === "Email already in use"
      ) {
        setValues((e) => ({
          ...values,
          email: "",
        }));
        toast.error("Email already in use");
      } else if (
        res.status === 252 &&
        res.data.message === "Username is taken"
      ) {
        setValues(() => ({
          ...values,
          username: "",
        }));
        toast.error("username already in use");
      }
    });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="SignUp">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up </h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="FormButton">Submit</button>
      </form>
      <a href="/Login">Login</a>
    </div>
  );
}

export default SignUpForm;
