Reservation frontend made with Next.js and styled-components.

For date select I used datepicker library, while time select was developed by myself.
Time select shows available times, if the time is reservated it will be disabled and shown red.

Added utility functions, and spiled code into components.

## How it works

On each request, fetches reservations from the server and creates base times array to select in times table (default 20). On date picker click event, utility function maps the unavailable times based on selected dates month and day. The handler creates new array with extra key taken. This is passed to components props and renders accordingly.

Components uses callbacks to invoke handlers on controled component.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
