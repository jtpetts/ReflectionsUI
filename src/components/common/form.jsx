import React from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

const validate = (schema, data) => {
  const result = Joi.validate(data, schema, { abortEarly: false });
  if (!result.error) return null;

  let errors = {};
  result.error.details.map(error => (errors[error.path[0]] = error.message));
  return errors;
};

export const handleSubmit = (e, doSubmit, schema, data, setErrors) => {
  e.preventDefault();

  const errors = validate(schema, data);
  setErrors(errors || {});
  if (errors) return;

  doSubmit();
};

const validateProperty = ({ name, value }, schema) => {
  const obj = { [name]: value };
  const miniSchema = { [name]: schema[name] };

  const { error } = Joi.validate(obj, miniSchema);
  return error ? error.details[0].message : null;
};

export const handleChange = ({ currentTarget: input }, schema, setDataItem, setError) => {
  const errorMessage = validateProperty(input, schema);
  setError(input.name, errorMessage);
  setDataItem(input.name, input.value);
};

export const renderSubmitButton = (label, schema, data) => {
  return (
    <button disabled={validate(schema, data)} className="btn btn-primary">
      {label}
    </button>
  );
}

export const renderInput = (label, name, schema, data, setDataItem, errors, setError, type = "text") => {
  return (
    <Input
      type={type}
      name={name}
      label={label}
      value={data[name]}
      onChange={e => handleChange(e, schema, setDataItem, setError)}
      error={errors[name]}
    />
  );
}

export const renderSelect = (label, name, options, schema, data, setDataItem, errors, setError) => {
  return (
    <Select
      name={name}
      label={label}
      value={data[name]}
      onChange={e => handleChange(e, schema, setDataItem, setError)}
      error={errors[name]}
      options={options}
    />
  );
}

const form = {
  handleSubmit,
  handleChange,
  renderSubmitButton,
  renderInput,
  renderSelect
};

export default form;
