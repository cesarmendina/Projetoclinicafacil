import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { User, Specialty, Doctor, Appointment } from '../App';
import { Clock } from 'lucide-react';

interface TimeSelectionProps {
  user: User;
  specialty: Specialty;
  doctor: Doctor;
  appointments: Appointment[];
  onSelectTime: (date: Date, time: string) => void;
  onBack: () => void;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

export default function TimeSelection({
  user,
  specialty,
  doctor,
  appointments,
  onSelectTime,
  onBack
}: TimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const isTimeAvailable = (date: Date, time: string) => {
    const dateString = date.toISOString().split('T')[0];
    return !appointments.some(
      app => app.doctorId === doctor.id && app.date === dateString && app.time === time
    );
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelectTime(selectedDate, selectedTime);
    }
  };

  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Voltar
        </Button>

        <Card className="p-6 mb-6">
          <h1 className="mb-2">Escolha a Data e Horário</h1>
          <p className="text-gray-600">
            {doctor.name} - {specialty.name}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="mb-4">Selecione a data</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDates}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Horários disponíveis</h3>
            
            {!selectedDate ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecione uma data para ver os horários disponíveis</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {timeSlots.map((time) => {
                  const available = isTimeAvailable(selectedDate, time);
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => available && setSelectedTime(time)}
                      disabled={!available}
                      className="h-12"
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            )}

            {selectedDate && selectedTime && (
              <div className="mt-6 pt-6 border-t">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-600">Horário selecionado:</p>
                  <p>
                    {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                  </p>
                </div>
                <Button onClick={handleContinue} size="lg" className="w-full">
                  Continuar para confirmação
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
