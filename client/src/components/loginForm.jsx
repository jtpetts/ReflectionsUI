import React, { useState } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import authService from "../services/authService";
import { handleSubmit, renderSubmitButton, renderInput } from "./common/form";

function LoginForm(props) {
  const [data, setData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  // update a single error, can also clear the value
  const setError = (inputName, errorMessage) => {
    if (errorMessage)
      setErrors({ ...errors, [inputName]: errorMessage });
    else {
      let { [inputName]: _, ...newErrors } = errors; // clear the one error message
      setErrors(newErrors);
    }
  }

  // update a single item of data
  const setDataItem = (inputName, inputValue) => {
    setData({ ...data, [inputName]: inputValue });
  }

  const schema = {
    username: Joi.string()
      .email()
      .required()
      .label("Username"),
    password: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .required()
      .label("Password")
  };

  const doSubmit = async (onSuccessfulLogin) => {
    // call server, login!
    try {
      await authService.login(
        data.username,
        data.password
      );

      onSuccessfulLogin();
    } catch (ex) {
      if (ex.response && ex.response.status >= 400) {
        const newErrors = { ...errors };
        newErrors.username = ex.response.data;
        setErrors(newErrors);

        toast.error("Access denied!");
      }
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, () => doSubmit(props.onSuccessfulLogin), schema, data, setErrors)}>
        {renderInput("Username", "username", schema, data, setDataItem, errors, setError)}
        {renderInput("Password", "password", schema, data, setDataItem, errors, setError, "password")}
        {renderSubmitButton("Login", schema, data)}
      </form>
    </div>
  );
}

export default LoginForm;
