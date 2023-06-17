import React from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Form, Input, message } from "antd";
import "../styles/registerStyle.css";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("successfully registered");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("error occured");
    }
  };
  return (
    <>
      <div className="form-container">
        <Form layout="vertical" onFinish={onfinishHandler} className="reg_form">
          <h1 className="text-center">Register</h1>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="text" required />
          </Form.Item>
          <Link to="/login" className="m-2">
            Already have an acount login
          </Link>
          <button className="btn btn-primary" type="submit">
            signup
          </button>
        </Form>
      </div>
    </>
  );
};

export default Register;
