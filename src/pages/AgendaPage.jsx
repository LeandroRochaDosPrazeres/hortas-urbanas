import React from "react";
import { Card, PageTitle } from "../components/UIKit.jsx";

// Dados mocados (substituir pelo Firestore depois)
const eventos = [
  { id: 1, titulo: "Mutirão de Limpeza - Horta da Praça", data: "30 de Outubro, 09:00", local: "Horta da Praça" },
  { id: 2, titulo: "Oficina de Compostagem", data: "05 de Novembro, 14:00", local: "Horta Comunitária da Lapa" },
  { id: 3, titulo: "Plantio de Primavera", data: "10 de Novembro, 10:00", local: "Horta da Praça" },
];

const AgendaPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <PageTitle>Agenda de Atividades</PageTitle>
      <p className="mb-6 rounded-lg border border-yellow-600 bg-yellow-900/20 p-4 text-yellow-200">
        Agenda demonstrativa: os eventos, datas e locais abaixo são exemplos e não representam atividades confirmadas.
      </p>
      <div className="space-y-6">
        {eventos.map((evento) => (
          <Card key={evento.id} className="w-full">
            <p className="mb-2 text-sm font-semibold text-yellow-300">Exemplo — não confirmado</p>
            <h3 className="text-xl font-bold text-green-400 mb-2">{evento.titulo}</h3>
            <p className="text-gray-300"><span className="font-semibold">Quando:</span> {evento.data}</p>
            <p className="text-gray-300"><span className="font-semibold">Onde:</span> {evento.local}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgendaPage;
