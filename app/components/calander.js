"use client"
import { useState, useEffect } from 'react';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Calendar = ({ onDateSelect }) => {
    const [currentdate, setcurrentdate] = useState(new Date());
    const [selectedmonth, setselectedmonth] = useState(currentdate.getMonth());
    const [selectedyear, setselectedyear] = useState(currentdate.getFullYear());

    useEffect(() => {
        setcurrentdate(new Date(selectedyear, selectedmonth));
    }, [selectedmonth, selectedyear]);

    const showcal = () => {
        const firstday = new Date(selectedyear, selectedmonth, 1);
        
        const lastday = new Date(selectedyear, selectedmonth + 1, 0);
        const totalinmonth = lastday.getDate();
        const firstDayIndex = firstday.getDay();
        const days = [];
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(null); 
        }
        for (let day = 1; day <= totalinmonth; day++) {
            days.push(day);
        }
        return days;
    };

    const changeMonth = (direction) => {
        if (direction === 'nexx') {
            if (selectedmonth === 11) {
                setselectedmonth(0);
                setselectedyear(selectedyear + 1);
            } else {
                setselectedmonth(selectedmonth + 1);
            }
        } else if (direction === 'prev') {
            if (selectedmonth === 0) {
                setselectedmonth(11);
                setselectedyear(selectedyear - 1);
            } else {
                setselectedmonth(selectedmonth - 1);
            }
        }
    };

    const handleClickDay = (day) => {
        if (day) {
            const selectedDate = { day, month: selectedmonth, year: selectedyear };
            onDateSelect(selectedDate);
        }
    };

    return (
        <div className="w-[90%] h-full  bg-[#212121]">
            <div className="calendar-header">
                <button className="prev-btn" onClick={() => changeMonth('prev')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"/></svg></button>
                <div className="month-year">{monthNames[selectedmonth]} {selectedyear}</div>
                <button className="next-btn" onClick={() => changeMonth('nexx')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
            </div>

            <div className="calendar-grid mt-2 mb-2">
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Sun</div>
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Mon</div>
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Tue</div>
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Wed</div>
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Thu</div>
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Fri</div>
                <div className="flex bg-[#212121] px-3 items-center justify-center text-white">Sat</div>

                {showcal().map((day, index) => (
                    <button
                    key={index}
                    className={`m-2 ${
                        day
                            ? "bg-[#474747] hover:bg-[#303030]  hover:border-[#474747] border border-transparent hover:text-white text-center py-4 transition-colors"
                            : "bg-[#00000]  text-transparent cursor-default"
                    } rounded-full `}
                    onClick={() => handleClickDay(day)}
                >
                    {day || ''}
                </button>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
