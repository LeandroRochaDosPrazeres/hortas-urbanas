import React from 'react';
import { Card } from '../components/UIKit.jsx'; // <--- CORREÇÃO AQUI

const HomePage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-green-400 mb-4">Bem-vindo ao Hortas Urbanas</h1>
        <p className="text-gray-300">
          Consulte o mapa de hortas e terrenos, conheça as plantas e encontre orientações de cultivo.
          Participe do fórum da comunidade, relate um terreno ou envie seu interesse em ser voluntário.
        </p>
      </Card>
    </div>
  );
};

export default HomePage;
