import React from "react";
import Layout from "./../components/Layout";
import { Tabs, message } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  //console.log(user.notification);
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const result = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (result.data.success) {
        message.success(result.data.message);
      } else {
        message.error(result.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const result = await axios.post(
        "/api/v1/user/get-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (result.data.success) {
        message.success(result.data.message);
      }
      //else message.error(res.data.message)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <h4 className="p-3 text-center">notification page</h4>
      <Tabs>
        <Tabs.TabPane tab="unRead" key={0}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2"
              onClick={handleMarkAllRead}
              style={{ cursor: "pointer" }}
            >
              mark all read
            </h4>
          </div>
          {user?.notification.map((notifi) => {
            return (
              <div
                className="card"
                onClick={notifi.onClickPath}
                style={{ cursor: "pointer" }}
              >
                <div className="card-text">{notifi.message}</div>
              </div>
            );
          })}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Read" key={1}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2"
              onClick={handleDeleteAllRead}
              style={{ cursor: "pointer" }}
            >
              delete all read
            </h4>
          </div>
          {user?.seennotification.map((notifi) => {
            return (
              <div
                className="card"
                onClick={notifi.onClickPath}
                style={{ cursor: "pointer" }}
              >
                <div className="card-text">{notifi.message}</div>
              </div>
            );
          })}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
