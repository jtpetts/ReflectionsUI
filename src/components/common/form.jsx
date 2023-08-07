import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = { data: {}, errors: {} };

  validate = () => {
    const result = Joi.validate(this.state.data, this.schema, {
      abortEarly: false
    });

    let errors = {};

    if (!result.error) return null;

    result.error.details.map(error => (errors[error.path[0]] = error.message));

    return errors;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };

    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    this.setState({ errors });

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  renderSubmitButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(label, name, type = "text") {
    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={this.state.data[name]}
        onChange={this.handleChange}
        error={this.state.errors[name]}
      />
    );
  }

  renderSelect(label, name, options) {
    return (
      <Select
        name={name}
        label={label}
        value={this.state.data[name]}
        onChange={this.handleChange}
        error={this.state.errors[name]}
        options={options}
      />
    );
  }
}

export default Form;
