"use client"

import { useState } from 'react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

type BigCalendarProps = {
  data: {
    title: string;
    start: Date;
    end: Date;
  }[]
}

const BigCalendar = ({data }: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView : View) => {
    setView(selectedView)
  }

  return (
    <Calendar
      localizer={localizer}
      events={data}
      defaultDate={new Date(2026, 7, 12)}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      onView={handleOnChangeView}
      style={{ height: "96%" }}
      min={new Date(2026, 1, 0, 8, 0, 0)}
      max={new Date(2026, 1, 0, 17, 0, 0)}
    />
  )
}


export default BigCalendar