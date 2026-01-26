# Setores de Estoque - Integração Dinâmica

## Resumo das Alterações

Este documento descreve as alterações realizadas para trazer informações dinâmicas para a tabela de Setores de Estoque, conectando corretamente com lançamentos e produtos.

## Problemas Identificados

1. ✅ **Dados Mockados**: O componente `SectorTable.tsx` estava usando dados estáticos (MOCK_SECTORS)
2. ✅ **Campos Faltantes**: A tabela `setores` no banco não tinha campos essenciais:
   - `responsavel` (VARCHAR)
   - `localizacao` (TEXT)
   - `status` (VARCHAR com CHECK constraint)
3. ✅ **Contagem Dinâmica**: O campo `totalItens` precisava ser calculado dinamicamente

## Solução Implementada

### 1. Migration do Banco de Dados

**Arquivo**: `backend/database/add_sector_fields.sql`

Adicionamos três novos campos à tabela `setores`:
- `responsavel`: Nome do responsável pelo setor
- `localizacao`: Localização física do setor
- `status`: Status operacional (Ativo, Inativo, Em Manutenção)

**Como executar**:
```sql
-- Execute este script no SQL Editor do Supabase
-- Ou use o comando:
psql -h [host] -U [user] -d [database] -f backend/database/add_sector_fields.sql
```

### 2. Backend Controller

**Arquivo**: `backend/src/controllers/inventoryController.js`

**Método atualizado**: `listSectors`

**Mudanças**:
- Busca todos os setores não deletados
- Para cada setor, conta dinamicamente quantos produtos estão associados
- Retorna dados enriquecidos com `totalItens` calculado

```javascript
async listSectors(req, res) {
    // 1. Buscar setores
    const { data: sectors } = await supabase
        .from('setores')
        .select('*')
        .eq('deletado', false);
    
    // 2. Enriquecer com contagem de produtos
    const enrichedSectors = await Promise.all(
        sectors.map(async (sector) => {
            const { count } = await supabase
                .from('produtos')
                .select('*', { count: 'exact', head: true })
                .eq('setor', sector.id)
                .eq('deletado', false);
            
            return { ...sector, totalItens: count || 0 };
        })
    );
    
    res.json(enrichedSectors);
}
```

### 3. Frontend Component

**Arquivo**: `components/stock/SectorTable.tsx`

**Mudanças principais**:

1. **Importações**:
   - Adicionado `useEffect` e `useState` do React
   - Importado `inventoryService` para comunicação com API

2. **Estados**:
   ```typescript
   const [sectors, setSectors] = useState<InventorySector[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   ```

3. **Fetch de Dados**:
   ```typescript
   useEffect(() => {
       const fetchSectors = async () => {
           const data = await inventoryService.listSectors();
           setSectors(data);
       };
       fetchSectors();
   }, []);
   ```

4. **UI States**:
   - **Loading**: Spinner animado enquanto carrega
   - **Error**: Mensagem de erro com botão de retry
   - **Success**: Tabela com dados dinâmicos

5. **Tratamento de Nulos**:
   - `responsavel`: Mostra "Não atribuído" se nulo
   - `localizacao`: Mostra "Não definido" se nulo
   - Iniciais do responsável: Mostra "--" se nulo

## Conexão com Produtos e Lançamentos

### Produtos
- Cada produto tem um campo `setor` (UUID) que referencia `setores.id`
- A contagem de `totalItens` é feita através desta relação
- Apenas produtos não deletados são contabilizados

### Lançamentos
- Os itens de lançamento (`lancamentos_itens`) também têm campo `setor`
- Quando um lançamento é criado/atualizado, o estoque dos produtos é atualizado
- Os produtos são filtrados por setor, permitindo visualização organizada

## Fluxo de Dados

```
┌─────────────────┐
│  SectorTable    │
│   (Frontend)    │
└────────┬────────┘
         │
         │ GET /api/inventory/sectors
         ▼
┌─────────────────┐
│ inventoryService│
│  (API Client)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend Routes  │
│ /api/inventory  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│inventoryController
│  .listSectors() │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Tabela setores │────▶│ Tabela produtos │
│   (Supabase)    │     │   (Contagem)    │
└─────────────────┘     └─────────────────┘
```

## Testes Recomendados

1. **Verificar Migration**:
   ```sql
   SELECT * FROM setores;
   -- Deve mostrar os novos campos: responsavel, localizacao, status
   ```

2. **Testar API**:
   ```bash
   curl http://localhost:3001/api/inventory/sectors
   # Deve retornar JSON com totalItens calculado
   ```

3. **Verificar Frontend**:
   - Abrir a página de Setores
   - Verificar se os dados são carregados dinamicamente
   - Testar busca por nome e responsável
   - Verificar estados de loading e error

## Próximos Passos

1. ✅ Executar migration no banco de dados
2. ✅ Reiniciar o backend para aplicar mudanças
3. ✅ Testar a interface no navegador
4. 🔲 Adicionar funcionalidade de edição de setores
5. 🔲 Implementar modal de visualização detalhada
6. 🔲 Adicionar filtros avançados (por status, responsável, etc.)

## Arquivos Modificados

- ✅ `backend/database/add_sector_fields.sql` (NOVO)
- ✅ `backend/src/controllers/inventoryController.js` (MODIFICADO)
- ✅ `components/stock/SectorTable.tsx` (MODIFICADO)
- ✅ `services/inventoryService.ts` (JÁ EXISTIA - sem mudanças necessárias)

## Notas Importantes

- A migration é **idempotente** (pode ser executada múltiplas vezes sem problemas)
- O soft delete está mantido (campo `deletado`)
- A contagem de produtos é feita em tempo real a cada requisição
- Para melhor performance em produção, considere adicionar cache ou views materializadas
