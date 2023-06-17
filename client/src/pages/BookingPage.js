import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { DatePicker, TimePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const param = useParams();
  const [doctor, setDoctor] = useState(null);
  const [isAvailable, setIsAvailable] = useState();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: param._id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Data & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: param._id,
          userId: user.user._id,
          userInfo: user.user,
          doctorInfo: doctor,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/check-availability",
        {
          doctorId: doctor._id,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h3 className="text-center">BookingPage</h3>

      <div className="container m-2">
        {doctor && (
          <div>
            <h4>
              Dr.{doctor.firstName} {doctor.lastName}
            </h4>
            <h4>Specialist:{doctor.specialization}</h4>
            <h4>Experience:{doctor.experience}</h4>
            <h4>
              Timing:{doctor.timing[0]}-{doctor.timing[1]}
            </h4>
            <h4>Fees:{doctor.feePerCunsaltation}</h4>
            <div className="d-flex flex-column w-50 ">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                className="m-2"
                format="HH:mm"
                onChange={(values) => {
                  setTime(moment(values).format("HH:mm"));
                }}
              />
              <button
                className="btn btn-primary m-2"
                onClick={handleAvailability}
              >
                check availavility
              </button>

              <button
                className="btn dark btn-primary m-2"
                onClick={handleBooking}
              >
                book now
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
