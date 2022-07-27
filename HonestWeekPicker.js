import React, { useState, useEffect } from "react";
import "./honestWeekStyle.css";
import { v4 } from "uuid";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";

export const HonestWeekPicker = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [week, setWeek] = useState({
    firstDay: new Date().setDate(
      new Date().getDate() - new Date().getDay() + 1
    ),
    lastDay: new Date().setDate(new Date().getDate() - new Date().getDay() + 7)
  });

  useEffect(() => {
    onChange && onChange(week);
  }, [week]);

  const isLeapYear = () => {
    let leapYear = new Date(new Date().getFullYear(), 1, 29);
    return leapYear.getDate() == 29;
  };

  const convertDate = (date) => {
    let dt = new Date(date);

    return `${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}.`;
  };

  const handleClick = (e) => {
    setDate(new Date(date.setDate(e.target.id)));
    let localDate = new Date(date.setDate(e.target.id));

    const firstDay = new Date(
      localDate.setDate(localDate.getDate() - localDate.getDay() + 1)
    );
    const lastDay = new Date(
      localDate.setDate(localDate.getDate() - localDate.getDay() + 7)
    );

    setWeek({ firstDay, lastDay });
  };

  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun",
    "July",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec."
  ];

  const days = {
    "1": 31,
    "2": isLeapYear() ? 29 : 28,
    "3": 31,
    "4": 30,
    "5": 31,
    "6": 30,
    "7": 31,
    "8": 31,
    "9": 30,
    "10": 31,
    "11": 30,
    "12": 31
  };

  const renderDays = () => {
    let month = date.getMonth() + 1;
    let ar = [];
    for (let i = 1; i <= days[month]; i++) {
      let currentDate = new Date(date).setDate(i);

      let cName = "single-number ";
      if (
        new Date(week.firstDay).getTime() <= new Date(currentDate).getTime() &&
        new Date(currentDate).getTime() <= new Date(week.lastDay).getTime()
      ) {
        cName = cName + "selected-week";
      }

      ar.push(
        <div key={v4()} id={i} className={cName} onClick={handleClick}>
          {i}
        </div>
      );
    }

    const displayDate = new Date(date).setDate(1);
    let dayInTheWeek = new Date(displayDate).getDay();

    let empty = [];
    for (let i = 1; i < dayInTheWeek; i++) {
      empty.push(<div key={v4()} id={i} className="single-number empty"></div>);
    }
    return [...empty, ...ar];
  };

  const handleDate = (next) => {
    if (next) {
      let localDate = new Date(date);
      localDate.setMonth(localDate.getMonth() + 1);
      setDate(new Date(localDate));
      return;
    }
    let localDate = new Date(date);
    localDate.setMonth(localDate.getMonth() - 1);
    setDate(new Date(localDate));
  };

  const displayMonth = () => {
    let displayDate = new Date(date);

    return `${months[displayDate.getMonth()]} ${displayDate.getFullYear()}.`;
  };

  return (
    <div
      className="week-picker-display"
      onBlur={() => setOpen(false)}
      onClick={() => setOpen(true)}
      tabIndex={0}
    >
      <p>
        {convertDate(week.firstDay)} - {convertDate(week.lastDay)}
      </p>
      {open && (
        <div className="week-picker-options">
          <div className="title-week">
            <div onClick={() => handleDate()} className="arrow-container">
              {ArrowLeft}
            </div>
            {displayMonth()}
            <div onClick={() => handleDate(true)} className="arrow-container">
              {ArrowRight}
            </div>
          </div>
          <div className="numbers-container">
            <div className="single-number day">Mon</div>
            <div className="single-number day">Tue</div>
            <div className="single-number day">Wed</div>
            <div className="single-number day">Thu</div>
            <div className="single-number day">Fri</div>
            <div className="single-number day">Sat</div>
            <div className="single-number day">Sun</div>
          </div>
          <div className="numbers-container">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};
