import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { User, Appointment } from '../App';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar as CalendarIcon, X, Lock } from 'lucide-react';

interface DoctorScheduleProps {
  user: User;
  appointments: Appointment[];
  onBlockTime: (date: Date, time: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onLogout: () => void;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

export default function DoctorSchedule({
  user,
  appointments,
  onBlockTime,
  onCancelAppointment,
  onLogout
}: DoctorScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [selectedTimeToBlock, setSelectedTimeToBlock] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  const doctorAppointments = appointments.filter(
    app => app.doctorId === user.id
  );

  const todayAppointments = doctorAppointments.filter(app => {
    const today = new Date().toISOString().split('T')[0];
    return app.date === today;
  });

  const selectedDateAppointments = doctorAppointments.filter(app => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return app.date === dateString;
  });

  const getAppointmentForTime = (time: string) => {
    return selectedDateAppointments.find(app => app.time === time);
  };

  const handleBlockTime = () => {
    if (selectedTimeToBlock) {
      onBlockTime(selectedDate, selectedTimeToBlock);
      setShowBlockDialog(false);
      setSelectedTimeToBlock(null);
    }
  };

  const handleCancelAppointment = () => {
    if (appointmentToCancel) {
      onCancelAppointment(appointmentToCancel.id);
      setShowCancelDialog(false);
      setAppointmentToCancel(null);
    }
  };

  const openBlockDialog = (time: string) => {
    setSelectedTimeToBlock(time);
    setShowBlockDialog(true);
  };

  const openCancelDialog = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelDialog(true);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="mb-2">Minha Agenda</h1>
            <p className="text-gray-600">Bem-vindo(a), {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h3>Consultas Hoje</h3>
            </div>
            <p className="text-gray-600">{todayAppointments.length} agendamentos</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-orange-600" />
              <h3>Horários Bloqueados</h3>
            </div>
            <p className="text-gray-600">
              {doctorAppointments.filter(app => app.status === 'blocked').length} bloqueios
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              <h3>Total de Consultas</h3>
            </div>
            <p className="text-gray-600">
              {doctorAppointments.filter(app => app.status === 'confirmed').length} confirmadas
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <h3 className="mb-4">Selecione uma data</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3>
                Agenda - {selectedDate.toLocaleDateString('pt-BR')}
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  Livre
                </Badge>
                <Badge variant="outline">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  Agendado
                </Badge>
                <Badge variant="outline">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  Bloqueado
                </Badge>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map((time) => {
                    const appointment = getAppointmentForTime(time);
                    const isFree = !appointment;
                    const isBlocked = appointment?.status === 'blocked';
                    const isConfirmed = appointment?.status === 'confirmed';

                    return (
                      <TableRow key={time}>
                        <TableCell>{time}</TableCell>
                        <TableCell>
                          {isFree && (
                            <Badge variant="outline" className="bg-green-50">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              Livre
                            </Badge>
                          )}
                          {isBlocked && (
                            <Badge variant="outline" className="bg-red-50">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                              Bloqueado
                            </Badge>
                          )}
                          {isConfirmed && (
                            <Badge variant="outline" className="bg-blue-50">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              Agendado
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {appointment?.patientName || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {isFree && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openBlockDialog(time)}
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Bloquear
                            </Button>
                          )}
                          {appointment && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openCancelDialog(appointment)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bloquear Horário</DialogTitle>
              <DialogDescription>
                Deseja bloquear o horário {selectedTimeToBlock} do dia{' '}
                {selectedDate.toLocaleDateString('pt-BR')}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleBlockTime}>Confirmar bloqueio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar Agendamento</DialogTitle>
              <DialogDescription>
                {appointmentToCancel?.status === 'blocked'
                  ? 'Deseja desbloquear este horário?'
                  : `Deseja cancelar o agendamento de ${appointmentToCancel?.patientName}?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Não
              </Button>
              <Button onClick={handleCancelAppointment} variant="destructive">
                Sim, cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
