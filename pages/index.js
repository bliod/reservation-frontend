import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Select from "react-select"; //use later
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const Container = styled.section`
  background-color: papayawhip;
`;

const reservation = ({ data }) => {
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [isReservated, setIsReservated] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    console.log(`Submitting Name ${name} ${surname} ${date}`);
    let data = { name, surname, date };
    fetch(`http://localhost:8081/rest/v1/reservation/create`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        }
        // setIsReservated(true);
        console.log(data);
      });
  };

  return (
    <Container>
      {/* <Calendar onChange={setDate} value={date} /> */}
      {error ? <h1>Error</h1> : <h1>All good</h1>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            required
            placeholder="Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Surname:
          <input
            placeholder="Surname"
            required
            type="text"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </label>
        <label>
          Choose an appointment time :
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
        </label>
        <input type="submit" value="Submit" />
      </form>
    </Container>
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
