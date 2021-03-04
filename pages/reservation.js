import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Select from "react-select";

const options = [
  { value: "17:20", label: "17:20" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
];
// const op = Array()

const reservation = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [name, setName] = useState();
  const [surname, setSurname] = useState();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // let reservation = date.setHours(time);
    // console.log(time);
    alert(`Submitting Name ${name} ${surname} ${date} ${time}`);
  };

  return (
    <div>
      <Calendar onChange={setDate} value={date} />
      {/* {console.log(value)} */}

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
          {/* <Select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            options={options}
          /> */}
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="17:00">17:00</option>
            <option value="16:00">16:00</option>
            {/* <option value="lime">Lime</option> */}
            {/* <option value="coconut">Coconut</option> */}
            {/* <option value="mango">Mango</option> */}
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default reservation;
