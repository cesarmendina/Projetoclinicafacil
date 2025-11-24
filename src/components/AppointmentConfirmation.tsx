import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Specialty, Doctor } from '../App';
import { CheckCircle, Calendar, Clock, User as UserIcon, Stethoscope } from 'lucide-react';

interface AppointmentConfirmationProps {
  user: User;
  specialty: Specialty;
  doctor: Doctor;
  date: Date;
  time: string;
  onConfirm: () => void;
  onBack: () => void;
}

export default function AppointmentConfirmation({
  user,
  specialty,
  doctor,
  date,
  time,
  onConfirm,
  onBack
}: AppointmentConfirmationProps) {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="mb-2">Confirmar Agendamento</h1>
            <p className="text-gray-600">
              Revise as informações do seu agendamento antes de confirmar
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <UserIcon className="w-6 h-6 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-gray-600">Paciente</p>
                <p>{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Stethoscope className="w-6 h-6 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-gray-600">Médico</p>
                <p>{doctor.name}</p>
                <p className="text-gray-600">{specialty.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-gray-600">Data</p>
                <p>{date.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600 mt-1" />
              <div className="flex-1">
                <p className="text-gray-600">Horário</p>
                <p>{time}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Importante:</strong> Chegue com 15 minutos de antecedência. 
                Em caso de atraso superior a 10 minutos, o agendamento poderá ser cancelado.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Voltar
              </Button>
              <Button onClick={onConfirm} className="flex-1">
                Confirmar agendamento
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
