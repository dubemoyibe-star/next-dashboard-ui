"use client"

import { useState, useEffect } from 'react';
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  const handleOnChangeView = (selectedView : View) => {
    setView(selectedView)
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-md p-1`}>
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
    </div>
  )
}


export default BigCalendar