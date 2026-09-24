import React, { useEffect, useState } from 'react';
import { Card, PageTitle, Button } from '../components/UIKit.jsx';
import { getTodosUsuarios, atualizarStatusUsuario } from '../services/firestoreService.js';
import { useAuth } from '../context/AuthContext.jsx';

const AdminUsersPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aprovando, setAprovando] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    let ativo = true;
    const carregarUsuarios = async () => {
      setLoading(true);
      setError('');
      try {
        const lista = await getTodosUsuarios();
        if (ativo) setUsuarios(lista);
      } catch {
        if (ativo) setError('Não foi possível carregar os usuários. Recarregue a página para tentar novamente.');
      } finally {
        if (ativo) setLoading(false);
      }
    };
    carregarUsuarios();
    return () => { ativo = false; };
  }, [isAdmin]);

  const handleAprovar = async (uid) => {
    if (!isAdmin || aprovando) return;
    setAprovando(uid);
    setError('');
    try {
      await atualizarStatusUsuario(uid, 'aprovado');
      setUsuarios(lista => lista.map(u => u.id === uid ? { ...u, status: 'aprovado' } : u));
    } catch {
      setError('Não foi possível aprovar o usuário. Tente novamente.');
    } finally {
      setAprovando(null);
    }
  };

  // Segurança: Só renderiza se VOCÊ for o admin
  if (!isAdmin) {
    return <div className="p-10 text-center">Acesso Negado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <PageTitle>Gerenciamento de Usuários</PageTitle>
        {loading && <p role="status">Carregando usuários...</p>}
        {error && <p role="alert" className="mb-4 text-red-400">{error}</p>}
        {!loading && !error && usuarios.length === 0 && <p>Nenhum usuário encontrado.</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3">Nome</th>
                <th className="py-3">Papel (Role)</th>
                <th className="py-3">Status</th>
                <th className="py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-gray-800">
                  <td className="py-4">{u.nome}</td>
                  <td className="py-4 capitalize">{u.role}</td>
                  <td className="py-4">
                    <span className={u.status === 'pendente' ? 'text-yellow-400' : 'text-green-400'}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4">
                    {u.status === 'pendente' && (
                      <Button variant="primary" disabled={Boolean(aprovando)} onClick={() => handleAprovar(u.id)}>
                        {aprovando === u.id ? 'Aprovando...' : 'Aprovar'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
