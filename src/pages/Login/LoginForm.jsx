import { useState } from "react";
import FormInput from "../../components/form/FormInput";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";

function LoginForm() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Enter Password",
      label: "Password",
      required: true,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios({
      method: "POST",
      data: {
        username: values.username,
        password: values.password,
      },
      withCredentials: true,
      url: "http://localhost:5000/login",
    }).then((res) => console.log(res));

    // const response = await fetch("http://localhost:5000/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     username: values.username,
    //     password: values.password,
    //   }),
    // });

    // const data = await response.json();

    // console.log(data);

    // if (response.status === 200) {
    //   // If signup is successful, redirect to the login page
    //   toast.success("Login successful");
    //   window.location.href = "/Home";
    // } else {
    //   // If signup fails, display an error message next to the username or email input field
    //   if (data.message === "User does not exist") {
    //     setValues(() => ({
    //       ...values,
    //       password: "",
    //     }));
    //     toast.error("User does not exist");
    //   } else if (data.message === "Invalid credentials") {
    //     setValues(() => ({
    //       ...values,
    //       password: "",
    //     }));
    //     toast.error("Username or password is incorect");
    //   }
    // }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button className="FormButton">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
