import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.section`
  background-color: papayawhip;
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
const TimeTableWrapper = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.3rem;
  .selection {
      color: white;
      background-color:rgb(0, 76, 151);

    }
  button {
    border: 0;
    background: none;
    color: inherit;
    padding: 0;
    margin: 0;
    outline: none;
    width: 4rem;
    height: 3rem;
    border-width: 1px!important;
    border-style: solid!important;
    border-color: rgba(0,0,0,.12);
    border-radius: 4px;
    &:hover {
      border-color: rgb(0, 76, 151);
    color:rgb(0, 76, 151);
    }

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
`;

const createTableTimes = (length = 20, startHour = 8) => {
  const availableTimes = Array(length).fill({ hour: 8, minutes: 0 })
  let initialTime = { hour: 8, minutes: 0 }
  const times = [];
  availableTimes.forEach((pres) => {
    (initialTime.hour == pres.hour && initialTime.minutes == 30) ? pres.hour += 1 : pres.hour;
    initialTime.minutes == 0 ? pres.minutes += 30 : pres.minutes = 0;
    initialTime = pres
    times.push({ ...pres })
  })
  return times
}

const reservation = ({ data, times }) => {
  const [date, setDate] = useState();
  const [submit, setSubmit] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isReservated, setIsReservated] = useState();
  const [error, setError] = useState();
  const [selection, setSelection] = useState(Array(20).fill(false));
  const [timeSelected, setTimeSelected] = useState();

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
        {/* <label>
          Choose an appointment date :
        </label> */}
        <DatePickerWrapper>
          <DatePicker
            selected={date}
            onChange={date => setDate(date)}
            inline
          />
          <TimeTableWrapper>

            <div style={{ paddingBottom: '0.5rem' }}>
              <label>
                Choose an appointment time :
               </label>
            </div>
            {times.map((el, idx) =>
              <button type="button" className={selection[idx] ? 'selection' : ''} onClick={() => { handleSelection(idx, el) }} key={idx}>
                {`${el.hour}:${el.minutes}` + (el.minutes === 0 ? '0' : '')}
              </button>
            )}
          </TimeTableWrapper>
        </DatePickerWrapper>

        <SubmitWrapper>
          <input type="submit" value="Submit" />
        </SubmitWrapper>

      </FormWrapper>


      <ErrorWrapper>
        {error ? <h5 style={{ color: "#ff3333" }}>{error}</h5> : <h5></h5>}
        {isReservated ? <h5>{isReservated}</h5> : <h5></h5>}
      </ErrorWrapper>
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
