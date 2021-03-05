import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Select from "react-select"; //use later
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// const axios = require("axios");

const reservation = ({ data }) => {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [isReservated, setIsReservated] = useState(false);
  console.log(data, "cia data");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // setDate((date) => {
    //   date.setHours(hour);
    //   date.setMinutes(minutes);
    //   date.setSeconds("00");
    console.log(`Submitting Name ${name} ${surname} ${date}`);
    let data = { name, surname, date };
    console.log("data");
    fetch(`http://localhost:8081/rest/v1/reservation/create`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => setIsReservated(true));
    // });
    // alert(`Submitting Name ${name} ${surname} ${date} ${hour}:${minutes}`);
  };

  return (
    <div>
      {/* <Calendar onChange={setDate} value={date} /> */}
      <DatePicker
        selected={date}
        onChange={(e) => setDate(e)}
        // excludeDates={[Date.parse("2021-03-04T10:00:00.575Z")]}
        // excludeDates={data.map((el) => Date.parse(el))}
        placeholderText="Select a date other than today or yesterday"
        showTimeSelect
        timeFormat="HH:mm"
        excludeTimes={[...data.map((el) => Date.parse(el))]}
      />
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            required
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Surname:
          <input
            required
            type="text"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </label>
        <label>
          Choose an appointment time (opening hours 8:00 to 18:00):
          {/* <input
            required
            type="time"
            name="time"
            step="900"
            max="18:00"
            min="8:00"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          /> */}
          {/* <select value={hour} onChange={(e) => setHour(e.target.value)}>
            <option value="17">17</option>
            <option value="16">16</option>
          </select>
          <select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
            <option value="00">00</option>
            <option value="30">30</option>
          </select> */}
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://localhost:8081/rest/v1/reservation`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default reservation;
