import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import breakpoint from 'Commons/breakpoints';

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
const ErrorWrapper = styled.div`
  flex: 1 1 100%;
  text-align: center;
  h4 {
    color: #ff3333;
  }
`;
const TimeTableWrapper = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.3rem;
  min-width: 250px;
  margin-left: 1rem;
  text-align: left;
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
    &:hover:not(.taken) {
    border-color: rgb(0, 76, 151);
    color:rgb(0, 76, 151);
    }

  }
  .taken {
    border-color: red;
    color: gray;
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
  const [selection, setSelection] = useState(Array(times.length).fill(false));
  const [timeSelected, setTimeSelected] = useState();
  const [timesAvailable, setTimesAvailable] = useState(times);

  useEffect(() => {
    setIsReservated();
    setError();
    // setTimesAvailable(times)
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

  const handleDatePick = (selectDate) => {
    const timesArray = createTableTimes();
    setDate(selectDate)
    const monthSelected = new Date(selectDate).getMonth();
    const daySelected = new Date(selectDate).getDate();

    const sameMonth = data.filter(el => new Date(el).getMonth() == monthSelected)
    const sameDay = sameMonth.filter(el => new Date(el).getDate() == daySelected)
    const unavailableTimes = sameDay.map(el => {
      let hour = new Date(el).getHours()
      let minutes = new Date(el).getMinutes()
      return { hour, minutes }
    })

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
    console.log(unavailableTimes, 'unavailableTimes')
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
          <DatePicker
            selected={date}
            onChange={(date) => { handleDatePick(date) }}
            inline
          />
          <TimeTableWrapper>

            <div style={{ paddingBottom: '0.5rem' }}>
              <label>
                Choose an appointment time :
               </label>
            </div>
            {timesAvailable.map((el, idx) => {
              if (el.taken) {
                return <button className='taken' type="button" key={idx}>
                  {`${el.hour}:${el.minutes}` + (el.minutes === 0 ? '0' : '')}
                </button>
              } else {
                return <button type="button" className={selection[idx] ? 'selection' : ''} onClick={() => { handleSelection(idx, el) }} key={idx}>
                  {`${el.hour}:${el.minutes}` + (el.minutes === 0 ? '0' : '')}
                </button>
              }
            })}
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
