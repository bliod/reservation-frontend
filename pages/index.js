import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TimeTable from '../components/TimeTable';
import DatePickerComponent from '../components/DatePickerComponent';
import MessageComponent from '../components/MessageComponent';
import { createTableTimes, getUnavailableTimes } from '../helpers/utilityFunctions';

const Container = styled.section`
  background-color: papayawhip;
  margin: 100px auto 0 auto;
  border-radius: 20px;
  box-shadow: 3px 3px 3px #ccc;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  max-width: 900px;

`;
const FormWrapper = styled.form`
  flex: 1 1 100%;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
`;
const InputContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 2rem;
  div {
    flex: 1 1 100%;
      input {
        height: 2rem;
        width: 50%;
        @media (max-width: 576px){
          width: 100%;
        };
      };
    };
`;
const Header = styled.div`
  margin: auto;
  text-align: center;
`;
const SubmitWrapper = styled.div`
  flex: 1 1 100%;
  text-align: center;
  margin-top: 3rem;
  input {
    height: 2rem;
    width: 9rem;
    background-color: rgb(0, 76, 151);
    color: white;
    outline: none;
    border: none;
    border-radius: 10px;
  }
`;

const DatePickerWrapper = styled.div`
  display: flex;
  div {
    flex: 1 1 50%;
  }
  div:last-of-type {
    flex: 2 1 100%;
  }
    @media (max-width: 576px){
      flex-flow: column nowrap;
      text-align: center;
      div:last-of-type {
      margin-left: 0;
      }
    }
`;

const reservation = ({ data, times }) => {
  const [date, setDate] = useState();
  const [submit, setSubmit] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isReservated, setIsReservated] = useState();
  const [error, setError] = useState();
  const [selection, setSelection] = useState(Array(times.length).fill(false));
  const [timeSelected, setTimeSelected] = useState();
  const [timesAvailable, setTimesAvailable] = useState(times);

  useEffect(() => {
    setIsReservated();
    setError();
  }, [setSubmit]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (timeSelected === undefined) {
      setError('Please select time')
      return
    }
    if (date === undefined) {
      setError('Please select Date')
      return
    }
    setSubmit(!submit);
    let dateSelected = date;
    dateSelected.setHours(timeSelected.hour, timeSelected.minutes);
    setDate(dateSelected)

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
          if (data.error.message.includes("E11000")) {
            setError("Reservation taken, please select other date");
          } //if duplicate
          setIsReservated();
        } else {
          setIsReservated(data);
          setError();
        }
      });
  };

  const handleSelection = (idx, time) => {
    const selectedArray = selection.map((el, index) => {
      return index == idx ? true : false;
    })
    setTimeSelected(time)
    setSelection(selectedArray)
  }

  const handleDatePick = (selectDate) => {
    const timesArray = createTableTimes();
    setDate(selectDate);
    const unavailableTimes = getUnavailableTimes(selectDate, data);

    if (unavailableTimes.length > 0) {
      let filterTimesTaken = timesArray;
      unavailableTimes.forEach(el => {
        timesArray.forEach((time, idx) => {
          if (el.hour === time.hour && el.minutes === time.minutes) {
            filterTimesTaken[idx] = { ...timesArray[idx], taken: true };
          }
        })
      })
      setTimesAvailable(filterTimesTaken)
    }
    if (unavailableTimes.length === 0) {
      setTimesAvailable(timesArray)
    }
  }

  return (
    <Container>
      <Header>
        <h1>Create Reservation</h1>
      </Header>
      <FormWrapper onSubmit={handleSubmit}>
        <InputContainer>
          <div>
            <div>Name:</div>
            <input
              required
              placeholder="Name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div>Surname:</div>
            <input
              placeholder="Surname"
              required
              type="text"
              name="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
        </InputContainer>
        <DatePickerWrapper>
          <DatePickerComponent currentDate={date} callback={handleDatePick}></DatePickerComponent>
          <TimeTable callback={handleSelection} timesToShow={timesAvailable} showSelected={selection}></TimeTable>
        </DatePickerWrapper>
        <SubmitWrapper>
          <input type="submit" value="Submit" />
        </SubmitWrapper>
      </FormWrapper>
      <MessageComponent error={error} success={isReservated}></MessageComponent>
    </Container>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://localhost:8081/rest/v1/reservation`);
  const data = await res.json();
  const times = createTableTimes()
  // Pass data to the page via props
  return { props: { data, times } };
}

export default reservation;
