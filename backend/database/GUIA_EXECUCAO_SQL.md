# 🗄️ Guia de Execução - Soft Delete em Todas as Tabelas

## 📋 O que este script faz?

Este script SQL adiciona o campo `deletado` em **todas as tabelas principais** do sistema SAOApp:

### ✅ Tabelas que receberão o campo `deletado`:
1. **produtos** - Produtos do estoque
2. **categorias** - Categorias de produtos
3. **setores** - Setores organizacionais (cria a tabela se não existir)
4. **fornecedores** - Fornecedores
5. **unidades** - Unidades/Instituições

### ✅ Campos adicionados:
- **deletado** (VARCHAR 3, default 'no') - Para soft delete
- **setor** (VARCHAR 100) - Na tabela produtos

### ✅ Extras:
- Cria índices para performance
- Insere 6 setores padrão
- Atualiza registros existentes com `deletado = 'no'`
- Adiciona comentários explicativos

---

## 🚀 Como Executar

### 1️⃣ Acesse o Supabase Dashboard
```
https://supabase.com/dashboard
```

### 2️⃣ Selecione o Projeto
- Escolha o projeto **SAOApp**

### 3️⃣ Abra o SQL Editor
- Menu lateral → **SQL Editor**
- Clique em **New Query**

### 4️⃣ Cole e Execute o Script
- Abra o arquivo: `backend/database/add_soft_delete_all_tables.sql`
- Copie **TODO** o conteúdo
- Cole no SQL Editor
- Clique em **Run** ou pressione `Ctrl + Enter`

### 5️⃣ Verifique o Resultado
O script retornará uma tabela mostrando:
```
tabela        | column_name | data_type         | default | nullable
--------------|-------------|-------------------|---------|----------
produtos      | deletado    | character varying | 'no'    | YES
produtos      | setor       | character varying | NULL    | YES
categorias    | deletado    | character varying | 'no'    | YES
setores       | deletado    | character varying | 'no'    | YES
fornecedores  | deletado    | character varying | 'no'    | YES
unidades      | deletado    | character varying | 'no'    | YES
```

---

## ✅ Checklist Pós-Execução

Após executar o script, verifique:

- [ ] Script executado sem erros
- [ ] Tabela de verificação retornada com sucesso
- [ ] Campo `deletado` criado em todas as tabelas
- [ ] Campo `setor` criado na tabela produtos
- [ ] Tabela `setores` criada com 6 registros
- [ ] Índices criados para performance

---

## 🔄 Reiniciar o Backend

Após executar o script SQL, **reinicie o servidor backend**:

### Windows (PowerShell):
```powershell
# Encontrar o processo
netstat -ano | findstr :3001

# Matar o processo (substitua PID pelo número retornado)
taskkill /F /PID [PID]

# Reiniciar
.\start-backend.bat
```

---

## 🎯 Resultado Esperado

Após executar o script e reiniciar o backend:

### ✅ Categorias no Formulário
- O select de categorias será populado automaticamente
- Categorias existentes aparecerão na lista

### ✅ Soft Delete Funcionando
- Produtos, categorias e setores podem ser "excluídos"
- Dados são preservados no banco (deletado='yes')
- Não aparecem mais nas listagens

### ✅ Campo Setor
- Produtos podem ter setor definido
- Formulário de cadastro funcional

---

## 🐛 Solução de Problemas

### Erro: "column already exists"
✅ **Normal!** O script usa `IF NOT EXISTS`, então é seguro executar múltiplas vezes.

### Erro: "relation does not exist"
❌ **Problema:** Alguma tabela não existe no banco.
🔧 **Solução:** Verifique se todas as tabelas foram criadas corretamente.

### Categorias ainda não aparecem
🔧 **Soluções:**
1. Verifique se há categorias cadastradas no banco
2. Reinicie o backend
3. Limpe o cache do navegador (Ctrl + Shift + R)
4. Verifique o console do navegador (F12) para erros

---

## 📊 Estrutura Final das Tabelas

### produtos
```sql
- id (uuid)
- nome (text)
- codigo (text)
- categoria (uuid)
- setor (varchar 100) ← NOVO
- unidade_medida (text)
- estoque_minimo (integer)
- estoque_atual (integer)
- valor_referencia (numeric)
- descricao (text)
- deletado (varchar 3) ← NOVO
- created_at (timestamp)
```

### categorias
```sql
- id (uuid)
- nome (text)
- setor (text)
- descricao (text)
- deletado (varchar 3) ← NOVO
- created_at (timestamp)
```

### setores (NOVA TABELA)
```sql
- id (uuid)
- nome (varchar 100)
- descricao (text)
- deletado (varchar 3)
- created_at (timestamp)
```

---

## 🎉 Pronto!

Após executar o script:
1. ✅ Soft delete implementado em todas as tabelas
2. ✅ Categorias carregando no formulário
3. ✅ Campo setor disponível
4. ✅ Tabela setores criada
5. ✅ Sistema pronto para uso completo

**Execute o script agora e me avise quando terminar!** 🚀
