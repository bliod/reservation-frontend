import React from 'react';
import styled from "styled-components";

const ErrorWrapper = styled.div`
  flex: 1 1 100%;
  text-align: center;
  h4 {
    color: #ff3333;
  }
`;

const MessageComponent = ({ error, success }) => {
    return (
        <ErrorWrapper>
            {error ? <h5 style={{ color: "#ff3333" }}>{error}</h5> : <h5></h5>}
            {success ? <h5>{success}</h5> : <h5></h5>}
        </ErrorWrapper>
    );
}

export default MessageComponent;
