import { useState } from "react";
import "./form.scss";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const { label, errorMessage, onChange, id, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  const handleInputChange = (e) => {
    onChange(e);

    if (error && !e.target.value) {
      setError("");
    }
  };

  return (
    <div className="formInput">
      <label>{label}</label>
      <input
        {...inputProps}
        onChange={handleInputChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
        focused={focused.toString()}
      />
      <span className="formError">{error || errorMessage}</span>
    </div>
  );
};

export default FormInput;
