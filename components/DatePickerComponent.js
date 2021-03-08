import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ currentDate, callback }) => {
    return (
        <DatePicker
            selected={currentDate}
            onChange={(date) => { callback(date) }}
            inline
        />
    );
}

export default DatePickerComponent;
