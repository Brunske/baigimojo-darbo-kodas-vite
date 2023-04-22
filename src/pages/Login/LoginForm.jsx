import { useState } from "react";
import FormInput from "../../components/form/FormInput";
import axios, { Axios } from "axios";
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
    }).then((res) => {
      console.log(res.data.message);
      if (res.status === 200) {
        // If signup is successful, redirect to the login page
        toast.success("Login successful");
        window.location.href = "/";
      } else if (res.status === 210) {
        // If login fails, display an error message
        toast.error("Username or password is incorect");
      }
    });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const [data, setData] = useState(null);

  const getUser = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/login",
    }).then((res) => {
      if (res.status === 260) {
        toast.error("Session has expired, please login");
        window.location.href = "/signup";
      }
      console.log(res);
    });
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

      <button onClick={getUser}> Get User </button>
      {/* {
        data ? <h1>welcome back {data}</h1> : null
      } */}
    </div>
  );
}

export default LoginForm;
