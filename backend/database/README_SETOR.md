# Guia para Adicionar as Colunas 'setor' e 'deletado' na Tabela Produtos

## Passos para executar o script SQL no Supabase:

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto SAOApp

### 2. Abra o SQL Editor
- No menu lateral esquerdo, clique em **SQL Editor**
- Clique em **New Query** para criar uma nova consulta

### 3. Execute o Script
- Copie o conteúdo do arquivo `add_setor_to_produtos.sql`
- Cole no editor SQL
- Clique em **Run** ou pressione `Ctrl + Enter`

### 4. Verifique o Resultado
O script irá:
- ✅ Adicionar a coluna `setor` na tabela `produtos`
- ✅ Adicionar a coluna `deletado` na tabela `produtos` (para soft delete)
- ✅ Definir valor padrão `'no'` para a coluna `deletado`
- ✅ Atualizar produtos existentes com `deletado = 'no'`
- ✅ Criar índice para melhorar performance
- ✅ Adicionar comentários explicativos
- ✅ Mostrar a estrutura atualizada da tabela

### 5. Opcional: Popular dados existentes
Se você quiser que os produtos existentes herdem o setor da categoria, descomente as linhas do UPDATE no script:

```sql
UPDATE produtos p
SET setor = c.setor
FROM categorias c
WHERE p.categoria = c.id
AND p.setor IS NULL;
```

### 6. Reinicie o Backend
Após executar o script, reinicie o servidor backend para garantir que as mudanças sejam reconhecidas:

```bash
# Pare o backend atual (Ctrl+C no terminal)
# Execute novamente:
.\start-backend.bat
```

## Funcionalidades Implementadas

### 🗑️ Soft Delete
- Quando um produto é "excluído", ele não é removido do banco de dados
- O campo `deletado` é marcado como `'yes'`
- Produtos deletados não aparecem na listagem principal
- Os dados são preservados para histórico e auditoria
- Possibilidade de restauração futura

### 🎨 Modal de Confirmação
- Design moderno seguindo o padrão SAO
- Confirmação visual antes de excluir
- Aviso sobre a preservação dos dados
- Animações suaves e responsivas

## Verificação
Após executar o script, você poderá:
- ✅ Editar produtos e definir o setor
- ✅ Criar novos produtos com setor
- ✅ Visualizar o setor na listagem de produtos
- ✅ Excluir produtos com confirmação visual
- ✅ Produtos excluídos ficam ocultos mas preservados no banco

## Estrutura Esperada da Tabela 'produtos'
Após a execução, a tabela terá as seguintes colunas:
- id (uuid)
- nome (text)
- codigo (text)
- categoria (uuid) - FK para categorias
- **setor (varchar)** ← NOVA COLUNA
- unidade_medida (text)
- estoque_minimo (integer)
- estoque_atual (integer)
- valor_referencia (numeric)
- descricao (text)
- **deletado (varchar)** ← NOVA COLUNA (default: 'no')
- created_at (timestamp)

## Comportamento do Sistema

### Listagem de Produtos
- Mostra apenas produtos com `deletado = 'no'`
- Performance otimizada com índice

### Exclusão de Produtos
1. Usuário clica no botão de excluir
2. Modal de confirmação aparece
3. Usuário confirma a exclusão
4. Sistema marca `deletado = 'yes'`
5. Produto desaparece da listagem
6. Dados permanecem no banco para auditoria
