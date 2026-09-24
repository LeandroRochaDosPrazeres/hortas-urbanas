import React, { useState } from "react";
import { Card, Input, Button, Textarea, FileInput, PageTitle } from "../components/UIKit.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { criarRelatorioTerreno } from "../services/firestoreService.js";
import { uploadImage } from "../services/storageService.js";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";

const SeletorLocal = ({ localizacao, onSelect }) => {
  const map = useMapEvents({ click: (e) => onSelect(map.wrapLatLng(e.latlng)) });
  return (
    <>
      {localizacao && <CircleMarker center={localizacao} radius={10} />}
      <span aria-hidden="true" className="absolute inset-0 z-[400] pointer-events-none flex items-center justify-center text-3xl text-gray-900">+</span>
      <button type="button" onClick={() => onSelect(map.wrapLatLng(map.getCenter()))}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] rounded bg-green-700 px-3 py-2 text-white">
        Usar o centro do mapa
      </button>
    </>
  );
};

const ReportarTerrenoPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [areaM2, setAreaM2] = useState("");
  const [familias, setFamilias] = useState("");
  const [imagem, setImagem] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensagem("");
    if (!currentUser) return setError("Você precisa estar logado.");
    if (!titulo || !endereco || !imagem) return setError("Preencha os campos obrigatórios.");
    if (!localizacao) return setError("Marque a localização do terreno no mapa.");

    setLoading(true);
    try {
      const urlImagem = await uploadImage(imagem, 'terrenos');
      
      const dadosHorta = {
        titulo,
        descricao,
        endereco,
        imageUrl: urlImagem,
        areaM2: Number(areaM2),
        familiasAtendidas: Number(familias),
        latitude: localizacao.lat,
        longitude: localizacao.lng
      };

      await criarRelatorioTerreno(currentUser.uid, dadosHorta);
      setMensagem("Terreno reportado com sucesso!");
      setTimeout(() => navigate('/mapa'), 2000);
    } catch {
      setError("Erro ao enviar relatório.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <PageTitle>Reportar Novo Terreno</PageTitle>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Título" value={titulo} onChange={(e)=>setTitulo(e.target.value)} />
          <Input placeholder="Endereço" value={endereco} onChange={(e)=>setEndereco(e.target.value)} />
          <fieldset disabled={loading} className="space-y-2">
            <legend className="font-medium">Localização do terreno (obrigatória)</legend>
            <p className="text-sm text-gray-300">
              Marque no mapa o local correspondente ao endereço. Pelo teclado, use as setas para mover o mapa e selecione “Usar o centro do mapa”.
            </p>
            <div className="relative isolate h-72 overflow-hidden rounded-lg">
              <MapContainer center={[-23.5505, -46.6333]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <SeletorLocal localizacao={localizacao} onSelect={setLocalizacao} />
              </MapContainer>
            </div>
            <p aria-live="polite" className="text-sm text-gray-300">
              {localizacao ? `Ponto selecionado: ${localizacao.lat.toFixed(5)}, ${localizacao.lng.toFixed(5)}` : 'Nenhum ponto selecionado.'}
            </p>
          </fieldset>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Área (m²)" type="number" value={areaM2} onChange={(e)=>setAreaM2(e.target.value)} />
            <Input label="Famílias Estimadas" type="number" value={familias} onChange={(e)=>setFamilias(e.target.value)} />
          </div>

          <Textarea placeholder="Descrição" value={descricao} onChange={(e)=>setDescricao(e.target.value)} rows={3} />
          <FileInput onChange={(e) => setImagem(e.target.files[0])} />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Relatório ESG"}
          </Button>
          {mensagem && <p className="text-green-400 text-center">{mensagem}</p>}
          {error && <p className="text-red-400 text-center">{error}</p>}
        </form>
      </Card>
    </div>
  );
};

export default ReportarTerrenoPage;
