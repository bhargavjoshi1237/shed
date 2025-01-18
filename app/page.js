"use client"
import { useState } from "react";
import Calendar from "./components/calander";
import Booking from "./components/bookings";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hrName, setHrName] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  const handleLogin = () => {
    const name = window.prompt("Enter Name:");
    if (name) {
      setHrName(name);
    }
  };
  return (
    <div className="bg-[#161616]">
    <div className="w-[95%] ml-auto mr-auto bg-[#161616] h-[70px] flex items-center justify-end">
    <button 
          onClick={handleLogin}
          className="bg-[#212121] border border-[#474747] p-3 px-6 rounded-md hover:bg-[#303030]"
        >
          {hrName ? `Logged in as ${hrName}` : 'Login'}
        </button>
    </div>

    <div className="w-[97%] flex items-center justify-center bg-[#161616]">
      <div className="w-[70%] bg-[#161616] text-white min-h-screen flex flex-col items-center justify-center">
        <Calendar onDateSelect={handleDateSelect} />
      </div>
      <div className="w-[30%] bg-[#161616] flex items-center justify-center h-full">
      <div className="w-[95%] bg-[#161616] ml-auto mr-auto">
      {selectedDate && <Booking hrName={hrName} date={selectedDate} />}
      </div>
      </div>
    </div></div>
  );
}
