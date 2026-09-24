# QA de responsividade e fluxos — 24/09/2026

## Parecer

Responsividade aprovada na matriz abaixo, com ressalvas para homologação geral.
Não é garantia de funcionamento em todo aparelho, navegador, resolução ou estado de dados.
Nenhum deploy, push ou alteração no Firebase de produção foi realizado.

Branch: `fix/10-correcoes-experiencia-usuario`.
Início desta rodada: `a87ab3c`. Última correção de código: `d24bae9`.

## Ambiente e método

- Aplicação React/Vite real, executada localmente no navegador integrado do Codex.
- Firebase Auth/Firestore/Storage substituídos por implementações locais com dados fictícios. Não foram usados usuários, gravações ou uploads reais.
- Leaflet real na verificação visual; mapas usam as camadas públicas existentes do OpenStreetMap.
- Medição de largura do documento, presença de conteúdo, inspeção visual, navegação por teclado e testes de interação. A tabela administrativa possui rolagem horizontal interna intencional.
- Nomes, e-mails, endereços e publicações extensos, inclusive palavras sem espaços, além de dados normais, ausentes e falhas simuladas.
- Fixtures e ferramentas de teste ficaram em diretório temporário externo ao repositório. Não foi adicionada dependência nem configurada uma suíte de CI nesta rodada.

## Cobertura

576 verificações de layout: 16 rotas × 18 dimensões × 2 massas de dados.
Resultado: nenhuma página vazia ou largura de documento excedendo o viewport na matriz final.
Isso não substitui a inspeção de controles: botões invisíveis por hover e campos cortados foram encontrados separadamente e corrigidos.

224 verificações adicionais: 16 rotas × 7 perfis × 2 larguras (375 e 1440 px).
Perfis: visitante, standard, cultivador, biologicas, negocios, direito e admin.
Foram verificadas as restrições **da interface**, não a autorização das regras do Firebase.

Dimensões em pixels CSS:

| Grupo | Largura × altura |
|---|---|
| Celulares | 320×568, 360×800, 375×667, 390×844, 430×932 |
| Limites de layout | 639×800, 640×800, 767×1024, 768×1024 |
| Tablet / desktop | 1023×768, 1024×768, 1279×800, 1280×800 |
| Desktop amplo | 1440×900, 1920×1080, 2560×1440 |
| Paisagem | 667×375, 844×390 |

Rotas verificadas:

| Tela | Rota |
|---|---|
| Início | `/` |
| Login | `/login` |
| Cadastro de conta | `/cadastro` |
| Mapa | `/mapa` |
| Relato de terreno | `/reportar` |
| Voluntariado | `/apoie` |
| Agenda | `/agenda` |
| Fórum | `/forum` |
| Impacto | `/cadastrar-horta/:id` |
| Guias | `/manutencao` |
| Detalhe do guia | `/manutencao/:id` |
| Catálogo de plantas | `/plantas` |
| Detalhe da planta | `/plantas/:id` |
| Cadastro de planta | `/plantas/novo` |
| Edição de planta | `/plantas/editar/:id` |
| Administração | `/admin/usuarios` |

## Correções e evidências

Cada linha corresponde a um commit independente, com causa, alteração e validação no corpo da mensagem.

| Commit | Problema reproduzido | Correção / validação |
|---|---|---|
| `eff9ea2` | Nome comprido fazia o cabeçalho ocupar 2158 px em tela de 1280 px. | Limitar saudação e quebrar e-mail no menu móvel; largura normalizada. |
| `c539082` | Palavras longas estouravam fórum, guias, plantas e impacto. | Quebrar palavras na área principal e empilhar identificação do terreno no celular; sem cortar o conteúdo. |
| `27f9f1c` | Campos de área, famílias, sol e rega tinham textos cortados em 320 px. | Empilhar campos estreitos e manter rótulos visíveis; largura útil de 208/240 px no menor viewport. |
| `024b2b1` | Sair da conta no editor causava `Rendered fewer hooks than expected` e tela branca. | Manter a ordem dos hooks; cadastro e edição passam a mostrar acesso restrito sem derrubar o site. |
| `e809152` | Editar/excluir plantas tinham opacidade zero sem hover. | Ações sempre visíveis para perfis autorizados, com altura mínima de 44 px. |
| `67748f2` | Editor permitia envio antes de recuperar os dados atuais ou após falha. | Bloquear formulário em carregamento, ausência ou erro; preservar dados existentes. |
| `88148a9` | Impacto permitia preencher sem carregar o terreno e ocultava falha de envio. | Estados explícitos; erro de escrita preserva os campos para nova tentativa. |
| `0c09ea0` | Administração não informava erros e consultava usuários mesmo sem papel administrativo. | Guardar consulta, informar carga/erro/vazio e atualizar aprovação somente após sucesso. |
| `6823cca` | Colunas administrativas ficavam comprimidas no celular. | Tabela com largura mínima e região rolável focável; teclado move a tabela sem ampliar a página. |
| `1dd6414` | Erro de leitura aparecia como lista vazia, registro inexistente ou carregamento sem tratamento. | Alertas distintos em mapa, fórum, plantas e guias; respostas antigas não substituem detalhes atuais. |
| `64707c9` | Opção selecionada de perfil ficava cortada no cadastro em 320 px. | Encurtar textos, preservar valores e associar o rótulo ao seletor. |
| `d2d6b08` | Prévia de imagem permanecia escondida após trocar URL inválida por válida. | Restaurar exibição no carregamento bem-sucedido; confirmado `display: block`. |
| `d24bae9` | Planta sem foto dependia de placeholder externo; imagem inválida não tinha substituição. | SVG local no catálogo e detalhe; quatro cenários de ausência/erro carregaram corretamente. |

## Testes de comportamento

26 verificações automatizadas de componentes passaram, usando React e serviços do projeto com SDK Firebase simulado. Incluem as dez correções anteriores e regressões desta rodada:

- Relato exige localização, preserva coordenadas (inclusive zero), envia argumentos corretos e trata falha de upload/gravação.
- Voluntariado aceita e-mail, envia dados e limpa o formulário no sucesso.
- Mapa filtra coordenadas inválidas; menu mantém as oito rotas públicas.
- Impacto apresenta sete rótulos, bloqueia terreno ausente e preserva campos em erro.
- Métricas ausentes não aparecem; valor zero continua visível.
- Fórum usa nome ou identificação neutra, sem exibir o e-mail de autores antigos.
- Listas e detalhes distinguem falha de leitura de ausência de dados.
- Editor bloqueia carregamento inválido e não consulta dados para perfil sem acesso.
- Administração não consulta como visitante; falha de aprovação mantém o status pendente.

No navegador também foram exercitados login rejeitado/aceito, nome vazio no cadastro, cadastro simulado, voluntariado, cadastro/edição de planta, seleção de ponto no mapa, logout no editor, prévia de imagens e aprovação administrativa fictícia.
Em paisagem (667×375), a navegação por Tab alcançou o botão Sair, inclusive com e-mail extenso. Na tabela administrativa, a tecla direita moveu a rolagem interna mantendo a página em 320 px.

## Verificações técnicas

- `npm run build`: aprovado; permanecem avisos de tamanho do bundle e bases de navegadores desatualizadas.
- `git diff --check`: aprovado.
- ESLint: 13 erros preexistentes restantes, contra 14 no início desta rodada (16 na main). Nenhum novo erro identificado na comparação por regra e mensagem. O erro de hooks condicionais foi removido.
- `package.json`, lockfile e configurações de Firebase/deploy não foram modificados nesta rodada.

## Pendências e limites — não interpretar como aprovação de produção

1. **Especialista pendente:** com `role=biologicas` e `status=pendente`, o formulário de plantas ainda fica disponível. A interface consulta o papel, não a aprovação. Confirmar a política com o time e validar/enforçar o bloqueio tanto no cliente quanto nas regras do Firebase. Nenhuma gravação com esse perfil foi realizada no backend real.
2. **URL desconhecida:** um endereço sem rota cadastrada exibe cabeçalho/rodapé sem orientação. Continua pendente definir/adicionar o tratamento de página não encontrada; não foi criada nova página nesta rodada.
3. **Backend real:** não foram homologados login real, regras de Firestore/Storage, permissões, cotas, uploads persistidos ou integração de deploy. A simulação comprova comportamento da interface, não essas integrações.
4. **Dispositivos e motores:** dimensões foram emuladas no navegador integrado. Não houve execução física em iPhone/Android nem certificação independente em Safari, Chrome, Firefox e Edge. Teclado virtual, zoom real, área segura, gestos nativos e tecnologias assistivas exigem uma rodada específica.
5. **Dados e volume:** massas representativas não cobrem todo formato legado, centenas de registros ou desempenho sob carga. As verificações não são uma auditoria completa de segurança ou acessibilidade.

Antes do deploy, repetir os fluxos de gravação em ambiente Firebase isolado e validar ao menos um aparelho iOS e um Android, incluindo orientação, teclado virtual e upload de fotos. Não executar esse roteiro sobre dados de produção sem autorização específica.
