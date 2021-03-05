import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const Container = styled.section`
  background-color: papayawhip;
  width: 600px;
  height: 400px;
  margin: auto;
  border-radius: 20px;
  box-shadow: 3px 3px 3px #ccc;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`;
const FormWrapper = styled.form`
  flex: 1 1 100%;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
`;
const Header = styled.div`
  margin: auto;
  text-align: center;
`;
const SubmitWrapper = styled.div`
  flex: 1 1 100%;
  text-align: center;
  margin-top: 100px;
`;
const ErrorWrapper = styled.div`
  flex: 1 1 100%;
  text-align: center;
  h4 {
    color: #ff3333;
  }
`;
const LabelWrapper50 = styled.div`
  /* flex: 40%; */
  margin: 30px 0;
  max-width: 50%;
`;

const reservation = ({ data }) => {
  const [date, setDate] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [isReservated, setIsReservated] = useState();
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
          setError(data.error.message);
        }
        setIsReservated(data);
        // setIsReservated(true);
        console.log(data);
      });
  };

  return (
    <Container>
      <Header>
        <h1>Create Reservation</h1>
      </Header>
      <FormWrapper onSubmit={handleSubmit}>
        <LabelWrapper50>
          Name:
          <input
            required
            placeholder="Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabelWrapper50>
        <LabelWrapper50>
          Surname:
          <input
            placeholder="Surname"
            required
            type="text"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </LabelWrapper50>
        <label>
          Choose an appointment time :
          <DatePicker
            selected={date}
            onChange={(e) => setDate(e)}
            placeholderText="Select a date"
            showTimeSelect
            timeFormat="HH:mm"
            excludeTimes={[...data.map((el) => Date.parse(el))]}
          />
        </label>
        <SubmitWrapper>
          <input type="submit" value="Submit" />
        </SubmitWrapper>
      </FormWrapper>
      <ErrorWrapper>
        {error ? (
          <h5 style={{ color: "#ff3333" }}>{error}</h5>
        ) : (
          <h5>{isReservated}</h5>
        )}
      </ErrorWrapper>
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
