import React from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Form, Input, message } from "antd";
import "../styles/registerStyle.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("successfully logged in");
        navigate("/");
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
          <h1 className="text-center">Login</h1>
          <Form.Item label="Email" name="email">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="text" required />
          </Form.Item>
          <Link to="/signup" className="m-2">
            doesn't have an acount signup
          </Link>
          <button className="btn btn-primary" type="submit">
            login
          </button>
        </Form>
      </div>
    </>
  );
};

export default Login;
