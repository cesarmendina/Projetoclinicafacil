import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Specialty, Doctor } from '../App';
import { Stethoscope, Heart, Brain, Eye, Baby, Bone } from 'lucide-react';

interface SpecialtySelectionProps {
  user: User;
  onSelectSpecialty: (specialty: Specialty, doctor: Doctor) => void;
  onLogout: () => void;
}

const mockSpecialties: Specialty[] = [
  {
    id: 's1',
    name: 'Cardiologia',
    doctors: [
      { id: 'd1', name: 'Dr. Carlos Santos', specialtyId: 's1' },
      { id: 'd2', name: 'Dra. Maria Lima', specialtyId: 's1' }
    ]
  },
  {
    id: 's2',
    name: 'Neurologia',
    doctors: [
      { id: 'd3', name: 'Dr. Pedro Oliveira', specialtyId: 's2' },
      { id: 'd4', name: 'Dra. Ana Costa', specialtyId: 's2' }
    ]
  },
  {
    id: 's3',
    name: 'Oftalmologia',
    doctors: [
      { id: 'd5', name: 'Dr. João Alves', specialtyId: 's3' },
      { id: 'd6', name: 'Dra. Paula Rocha', specialtyId: 's3' }
    ]
  },
  {
    id: 's4',
    name: 'Pediatria',
    doctors: [
      { id: 'd7', name: 'Dra. Beatriz Silva', specialtyId: 's4' },
      { id: 'd8', name: 'Dr. Rafael Mendes', specialtyId: 's4' }
    ]
  },
  {
    id: 's5',
    name: 'Ortopedia',
    doctors: [
      { id: 'd9', name: 'Dr. Fernando Costa', specialtyId: 's5' },
      { id: 'd10', name: 'Dra. Juliana Pires', specialtyId: 's5' }
    ]
  },
  {
    id: 's6',
    name: 'Clínica Geral',
    doctors: [
      { id: 'd11', name: 'Dr. Lucas Ferreira', specialtyId: 's6' },
      { id: 'd12', name: 'Dra. Camila Souza', specialtyId: 's6' }
    ]
  }
];

const specialtyIcons: { [key: string]: React.ReactNode } = {
  'Cardiologia': <Heart className="w-8 h-8" />,
  'Neurologia': <Brain className="w-8 h-8" />,
  'Oftalmologia': <Eye className="w-8 h-8" />,
  'Pediatria': <Baby className="w-8 h-8" />,
  'Ortopedia': <Bone className="w-8 h-8" />,
  'Clínica Geral': <Stethoscope className="w-8 h-8" />
};

export default function SpecialtySelection({ user, onSelectSpecialty, onLogout }: SpecialtySelectionProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleContinue = () => {
    if (selectedSpecialty && selectedDoctor) {
      onSelectSpecialty(selectedSpecialty, selectedDoctor);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="mb-2">Escolha a Especialidade</h1>
            <p className="text-gray-600">Bem-vindo(a), {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>

        {!selectedSpecialty ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSpecialties.map((specialty) => (
              <Card
                key={specialty.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="text-blue-600">
                    {specialtyIcons[specialty.name]}
                  </div>
                  <h3>{specialty.name}</h3>
                  <p className="text-gray-600">
                    {specialty.doctors.length} médicos disponíveis
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedSpecialty(null);
                setSelectedDoctor(null);
              }}
              className="mb-4"
            >
              ← Voltar para especialidades
            </Button>

            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-600">
                  {specialtyIcons[selectedSpecialty.name]}
                </div>
                <h2>{selectedSpecialty.name}</h2>
              </div>
              <p className="text-gray-600">Selecione um médico para continuar</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedSpecialty.doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'ring-2 ring-blue-600 bg-blue-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3>{doctor.name}</h3>
                      <p className="text-gray-600">{selectedSpecialty.name}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedDoctor && (
              <div className="flex justify-end">
                <Button onClick={handleContinue} size="lg">
                  Continuar para escolha de horário
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
