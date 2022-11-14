import React, { useState, useEffect } from "react";
import "./honestWeekStyle.css";
import { v4 } from "uuid";
import { ArrowLeft } from "./ArrowLeft";
import { ArrowRight } from "./ArrowRight";
import { addMonths, endOfWeek, startOfWeek, subMonths } from "date-fns";
import { getDaysInMonth } from "date-fns/esm";

export const HonestWeekPicker = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [week, setWeek] = useState({
    firstDay: startOfWeek(new Date(), { weekStartsOn: 1 }),
    lastDay: endOfWeek(new Date(), { weekStartsOn: 1 })
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
    let localDate;
    if (e.target.id.includes("prev")) {
      localDate = new Date(date.setDate(1));
      setDate(new Date(date.setDate(1)));
    } else if (e.target.id.includes("next")) {
      localDate = new Date(date.setDate(getDaysInMonth(date)));
      setDate(new Date(date.setDate(getDaysInMonth(date))));
    } else {
      localDate = new Date(date.setDate(e.target.id));
      setDate(new Date(date.setDate(e.target.id)));
    }
    const firstDay = startOfWeek(localDate, { weekStartsOn: 1 });
    const lastDay = endOfWeek(localDate, { weekStartsOn: 1 });
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
    if (dayInTheWeek < 1) {
      dayInTheWeek = 7;
    }
    let prevMonth = [];
    let prevMonthDays = new Date(date).getMonth();
    if (prevMonthDays === 0) {
      prevMonthDays = 12;
    }
    for (let i = dayInTheWeek; i > 1; i--) {
      let previousMonth = new Date(date).setMonth(
        new Date(date).getMonth() - 1
      );
      let currentDate = new Date(previousMonth).setDate(
        days[prevMonthDays] - i + 2
      );
      let cName = "single-number other-month";
      let currentTime = new Date(currentDate).getTime();
      let firstTime = new Date(week.firstDay).getTime();
      let endTime = new Date(week.lastDay).getTime();
      if (currentTime >= firstTime && currentTime <= endTime) {
        cName = "single-number selected-week";
      }

      prevMonth.push(
        <div
          onClick={handleClick}
          key={v4()}
          id={"prev-" + i}
          className={cName}
        >
          {days[prevMonthDays] - i + 2}
        </div>
      );
    }

    let nextMonth = [];
    let fullDays = 35;
    if ([...prevMonth, ...ar].length > 35) {
      fullDays = 42;
    }

    for (let i = 1; i <= fullDays - [...prevMonth, ...ar].length; i++) {
      let cName = "single-number other-month";
      const lastDay = week.lastDay.getTime();
      const lastDayOfMonth = new Date(
        new Date(date).setDate(getDaysInMonth(date))
      );

      if (
        lastDayOfMonth.getTime() <= lastDay &&
        week.firstDay.getMonth() == lastDayOfMonth.getMonth()
      ) {
        cName = "single-number selected-week";
      }

      nextMonth.push(
        <div
          onClick={handleClick}
          key={v4()}
          id={"next-" + i}
          className={cName}
        >
          {i}
        </div>
      );
    }
    return [...prevMonth, ...ar, ...nextMonth];
  };

  const handleDate = (next) => {
    let localDate = new Date(date);
    if (next) {
      localDate = addMonths(localDate, 1);
    } else {
      localDate = subMonths(localDate, 1);
    }
    setDate(new Date(localDate));
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
            {`${months[date.getMonth()]} ${date.getFullYear()}.`}
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
