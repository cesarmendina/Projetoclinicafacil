import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import SpecialtySelection from './components/SpecialtySelection';
import TimeSelection from './components/TimeSelection';
import AppointmentConfirmation from './components/AppointmentConfirmation';
import DoctorSchedule from './components/DoctorSchedule';

export type UserType = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

export interface Specialty {
  id: string;
  name: string;
  doctors: Doctor[];
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'blocked';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'specialty' | 'time' | 'confirmation' | 'doctor-schedule'>('login');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientId: '1',
      patientName: 'João Silva',
      doctorId: 'd1',
      doctorName: 'Dr. Carlos Santos',
      specialty: 'Cardiologia',
      date: '2025-11-15',
      time: '10:00',
      status: 'confirmed'
    }
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.type === 'patient') {
      setCurrentPage('specialty');
    } else {
      setCurrentPage('doctor-schedule');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSpecialtySelect = (specialty: Specialty, doctor: Doctor) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctor(doctor);
    setCurrentPage('time');
  };

  const handleTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentPage('confirmation');
  };

  const handleConfirmAppointment = () => {
    if (currentUser && selectedSpecialty && selectedDoctor && selectedDate && selectedTime) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: currentUser.id,
        patientName: currentUser.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedSpecialty.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'confirmed'
      };
      setAppointments([...appointments, newAppointment]);
      setCurrentPage('specialty');
      setSelectedSpecialty(null);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const handleBackToSpecialty = () => {
    setCurrentPage('specialty');
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBackToTime = () => {
    setCurrentPage('time');
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleBlockTime = (date: Date, time: string) => {
    if (currentUser && currentUser.type === 'doctor') {
      const blockedAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: '',
        patientName: 'Bloqueado',
        doctorId: currentUser.id,
        doctorName: currentUser.name,
        specialty: '',
        date: date.toISOString().split('T')[0],
        time: time,
        status: 'blocked'
      };
      setAppointments([...appointments, blockedAppointment]);
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter(app => app.id !== appointmentId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentPage === 'specialty' && currentUser && (
        <SpecialtySelection 
          user={currentUser}
          onSelectSpecialty={handleSpecialtySelect}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'time' && currentUser && selectedSpecialty && selectedDoctor && (
        <TimeSelection
          user={currentUser}
          specialty={selectedSpecialty}
          doctor={selectedDoctor}
          appointments={appointments}
          onSelectTime={handleTimeSelect}
          onBack={handleBackToSpecialty}
        />
      )}
      
      {currentPage === 'confirmation' && currentUser && selectedSpecialty && selectedDoctor && selectedDate && selectedTime && (
        <AppointmentConfirmation
          user={currentUser}
          specialty={selectedSpecialty}
          doctor={selectedDoctor}
          date={selectedDate}
          time={selectedTime}
          onConfirm={handleConfirmAppointment}
          onBack={handleBackToTime}
        />
      )}
      
      {currentPage === 'doctor-schedule' && currentUser && currentUser.type === 'doctor' && (
        <DoctorSchedule
          user={currentUser}
          appointments={appointments}
          onBlockTime={handleBlockTime}
          onCancelAppointment={handleCancelAppointment}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
