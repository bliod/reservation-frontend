import React from 'react';
import styled from "styled-components";

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
    }

  }
  .taken {
    border-color: red;
    color: gray;
    }
`;
const TimeTable = ({ callback, timesToShow, showSelected }) => {
    return (
        <TimeTableWrapper>
            <div style={{ paddingBottom: '0.5rem' }}>
                <label>
                    Choose an appointment time :
                </label>
            </div>
            {timesToShow.map((el, idx) => {
                if (el.taken) {
                    return <button className='taken' type="button" key={idx}>
                        {`${el.hour}:${el.minutes}` + (el.minutes === 0 ? '0' : '')}
                    </button>
                } else {
                    return <button type="button" className={showSelected[idx] ? 'selection' : ''} onClick={() => { callback(idx, el) }} key={idx}>
                        {`${el.hour}:${el.minutes}` + (el.minutes === 0 ? '0' : '')}
                    </button>
                }
            })}
        </TimeTableWrapper>
    );
}

export default TimeTable;
