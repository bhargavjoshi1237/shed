"use client"
import { useState, useEffect } from 'react';

export default function Booking({ date, hrName }) {
    const [bookings, setBookings] = useState([]);
    const [editBooking, setEditBooking] = useState(null);
    const [error, setError] = useState('');

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const checkExistingBooking = (selectedTime) => {
        return bookings.some(booking => booking.time === selectedTime);
    };

    const handleEdit = (booking) => {
        setEditBooking(booking);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('do you want to delete this booking?')) {
            return;
        }
    
        try {
            const response = await fetch(`https://shedulexpres.onrender.com/deletebooking/${id}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) throw new Error('Delete failed');
            
            fetchBookings(date);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://shedulexpres.onrender.com/updatebooking/${editBooking.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    time: e.target.time.value,
                    hrname: e.target.hrname ? e.target.hrname.value : hrName,
                    description: e.target.description.value
                })
            });
    
            if (!response.ok) throw new Error('Update failed');
            
            setEditBooking(null);
            fetchBookings(date);
        } catch (error) {
            setError(error.message);
        }
    };
    
    const fetchBookings = async (date) => {
        try {
            const formattedDate = `${date.year}-${date.month+1}-${date.day}`;
            const response = await fetch(`https://shedulexpres.onrender.com/getbydate/${formattedDate}`);
            if (!response.ok) {
                throw new Error('fetch bookings eroor');
            }
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('fetch bookings eroor:', error);
        }
    };

    useEffect(() => {
        fetchBookings(date);
    }, [date]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        const selectedTime = e.target.time.value;

        if (checkExistingBooking(selectedTime)) {
            setError(`Time slot ${selectedTime} is already used`);
            return;
        }

        // Clear previous errors
        setError('');

        const formattedDate = `${date.year}-${date.month+1}-${date.day}`;
        
        console.log(formattedDate);
        try {
            const formData = {
                date: formattedDate,
                time: e.target.time.value,
                hrname: hrName || e.target.hrname.value,
                description: e.target.description.value
            };

            const response = await fetch('https://shedulexpres.onrender.com/addbydate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                throw new Error('create booking issue');
            }
    
            const result = await response.json();
            console.log(result.message);
            
            // Clear form
            e.target.reset();
            // Refresh bookings
            fetchBookings(date);
    
        } catch (error) {
            setError(error.message);
            console.error('Error creating booking:', error);
        }
    };

    return (
        <div className='bg-[#161616]' >
            <h3 className='-mt-32 mb-24 text-center text-4xl'>Bookings for {date.day} {monthNames[date.month].substring(0,3)} {(date.year)}</h3>
            
            <form className='flex' onSubmit={handleBookingSubmit}>
                <input 
                    type="time" 
                    name="time" 
                    required 
                    step="3600"
                    className='text-white bg-[#161616] border border-[#474747] rounded-md-'
                    onChange={(e) => {
                        const time = e.target.value.split(':')[0] + ':00';
                        e.target.value = time;
                    }}
                />

                {!hrName && (
                    <input 
                        type="text" 
                        name="hrname"
                        placeholder="HR Name"
                        required 
                        className="text-white bg-[#161616] border border-[#474747] mb-2 w-full"
                    />
                )}

                <input name="description" placeholder="Description" className='text-white bg-[#161616]'></input>
                <button type="submit" className='rounded-md bg-[#212121] p-2 border  border-[#474747]'>Book Slot</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div className='mt-4'>
                
                {bookings.length === 0 && <p>No bookings for this date</p>}
                {bookings.map((booking, index) => (
                    <div key={index} className='border border-[#474747] bg-green-500 p-2 w-[95%] ml-auto mr-auto rounded-md mt-2'>
                        <p>Time: {booking.time}</p>
                        <p>HR Name: {booking.hrname}</p>
                        <p>Description: {booking.description}</p>
                        <div className='flex gap-2'>
                            <button 
                                onClick={() => handleEdit(booking)}
                                className='bg-[#212121] p-1 rounded-md mt-2'
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(booking.id)}
                                className='bg-red-500 p-1 rounded-md mt-2'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {editBooking && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                        <div className='bg-[#161616] p-4 rounded-md w-96'>
                            <h3 className='text-white mb-4'>Edit Booking</h3>
                            <form onSubmit={handleUpdate}>
                                <input 
                                    type="time" 
                                    name="time"
                                    defaultValue={editBooking.time}
                                    required 
                                    step="3600"
                                    className='text-white bg-[#161616] border border-[#474747] mb-2 w-full'
                                />
                                <input 
                                    type="text" 
                                    name="hrname"
                                    defaultValue={editBooking.hrname}
                                    required 
                                    className='text-white bg-[#161616] border border-[#474747] mb-2 w-full'
                                />
                                <input 
                                    name="description"
                                    defaultValue={editBooking.description}
                                    className='text-white bg-[#161616] border border-[#474747] mb-2 w-full'
                                />
                                <div className='flex justify-end gap-2'>
                                    <button 
                                        type="button" 
                                        onClick={() => setEditBooking(null)}
                                        className='bg-red-500 p-2 rounded-md'
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className='bg-green-500 p-2 rounded-md'
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}