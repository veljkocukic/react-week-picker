import React, { useState } from "react";
import { HonestWeekPicker } from "../HonestWeekPicker";
import "./styles.css";

export default function App() {
  const [week, setWeek] = useState({ firstDay: "02-02-2022" });

  const convertDate = (date) => {
    let dt = new Date(date);

    return `${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}`;
  };

  const onChange = (week) => {
    setWeek(week);
    console.log(week);
  };

  return (
    <div className="App">
      <HonestWeekPicker onChange={onChange} />
      <h1>{convertDate(week.firstDay)}</h1>
    </div>
  );
}
