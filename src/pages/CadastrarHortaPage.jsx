import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, Input, Button, PageTitle } from '../components/UIKit.jsx';

const CadastrarHortaPage = () => {
  const { id } = useParams(); // Pega o ID do terreno vindo do mapa
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [terrenoInfo, setTerrenoInfo] = useState(null);
  const [carregandoTerreno, setCarregandoTerreno] = useState(true);
  const [error, setError] = useState('');
  
  const [esgData, setEsgData] = useState({
    areaM2: '',
    volColheitaKg: '',
    volCompostagemKg: '',
    tecnicaIrrigacao: '',
    familiasBeneficiadas: '',
    numeroVoluntarios: '',
    economiaCestaBasica: ''
  });

  // Carrega as informações do terreno para conferência
  useEffect(() => {
    let ativo = true;
    const fetchTerreno = async () => {
      if (!id) return;
      setCarregandoTerreno(true);
      setTerrenoInfo(null);
      setError('');
      try {
        const docSnap = await getDoc(doc(db, "terrenos", id));
        if (!ativo) return;
        if (docSnap.exists()) setTerrenoInfo(docSnap.data());
        else setError('Terreno não encontrado. Selecione outro no mapa.');
      } catch {
        if (ativo) setError('Não foi possível carregar o terreno. Volte ao mapa e tente novamente.');
      } finally {
        if (ativo) setCarregandoTerreno(false);
      }
    };
    fetchTerreno();
    return () => { ativo = false; };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terrenoInfo || carregandoTerreno || loading) return;
    setError('');
    setLoading(true);
    try {
      const docRef = doc(db, "terrenos", id);
      // Atualiza o terreno existente com as novas métricas ESG
      await updateDoc(docRef, {
        metrics: esgData,
        status: "ativo", // Muda de pendente para ativo ao receber métricas
        ultimaAtualizacao: serverTimestamp()
      });
      alert("Métricas ESG vinculadas com sucesso!");
      navigate('/mapa');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setError('Não foi possível salvar o relatório. Seus campos foram mantidos; tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!id) return <div className="p-10 text-center">Por favor, selecione uma horta no mapa primeiro.</div>;
  if (carregandoTerreno) return <p role="status" className="p-10 text-center">Carregando terreno...</p>;
  if (!terrenoInfo) return <p role="alert" className="p-10 text-center text-red-400">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <PageTitle>Cadastro de Impacto Social e Ambiental</PageTitle>
      
      {terrenoInfo && (
        <Card className="mb-6 bg-gray-800 border-green-500/30">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img src={terrenoInfo.imageUrl} alt="Horta" className="w-24 h-24 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white">{terrenoInfo.titulo}</h2>
              <p className="text-gray-400 text-sm">{terrenoInfo.endereco}</p>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Métricas Ambientais (E)">
          <div className="space-y-4">
            <Input label="Área Cultivável (m²)" type="number" required
              onChange={(e) => setEsgData({...esgData, areaM2: e.target.value})} />
            <Input label="Volume de Colheita (kg/mês)" type="number"
              onChange={(e) => setEsgData({...esgData, volColheitaKg: e.target.value})} />
            <Input label="Compostagem (kg/mês)" type="number"
              onChange={(e) => setEsgData({...esgData, volCompostagemKg: e.target.value})} />
            <Input label="Técnica de Irrigação" placeholder="Ex: Gotejamento"
              onChange={(e) => setEsgData({...esgData, tecnicaIrrigacao: e.target.value})} />
          </div>
        </Card>

        <Card title="Impacto Social (S)">
          <div className="space-y-4">
            <Input label="Famílias Beneficiadas" type="number"
              onChange={(e) => setEsgData({...esgData, familiasBeneficiadas: e.target.value})} />
            <Input label="Número de Voluntários" type="number"
              onChange={(e) => setEsgData({...esgData, numeroVoluntarios: e.target.value})} />
            <Input label="Economia Gerada (R$)" type="number"
              onChange={(e) => setEsgData({...esgData, economiaCestaBasica: e.target.value})} />
          </div>
        </Card>

        {error && <p role="alert" className="md:col-span-2 text-red-400">{error}</p>}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/mapa')}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Salvando..." : "Finalizar Relatório ESG"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CadastrarHortaPage;
