# 🔍 Verificação Manual - Módulo de Saídas de Estoque 📤

## 🚀 Funcionalidades Implementadas
1. **Página de Saídas de Estoque**: Visualização de histórico e criação de novas saídas.
2. **Formulário de Saída (ExitForm)**:
   - ✅ Seleção de Tipo: Perda, Uso Interno, Troca, Doação.
   - ✅ Destino e Solicitante: Campos específicos para rastreio.
   - ✅ Lista de Itens: Adição de múltiplos produtos com validação de estoque disponível.
   - ✅ Atualização Automática de Estoque: O sistema desconta automaticamente a quantidade do estoque.

## 🧪 Como Testar

### 1. Acesso
1. Vá para o menu lateral **Estoque** -> **Saídas**.
2. Ou acesse a URL: `http://localhost:3000/` e clique no card de saídas.

### 2. Criar uma Saída
1. Clique no botão **"+ Nova Saída"**.
2. Preencha:
   - **Tipo**: Ex: "Uso Interno".
   - **Destino**: Ex: "Cozinha".
   - **Solicitante**: Ex: "João".
3. Adicione um item:
   - Selecione um produto.
   - Veja que o sistema mostra o estoque disponível (Ex: "Disponível: 50 UN").
   - Insira uma quantidade (Ex: 5).
   - Clique em "+".
4. Clique em **"Confirmar Saída"**.

### 3. Verificar Resultado
1. A saída deve aparecer na lista de histórico com status **CONCLUÍDO**.
2. Vá para a tela de **Produtos**.
3. Verifique se o produto que você usou teve sua quantidade reduzida (Ex: de 50 para 45).

## 🛠️ Detalhes Técnicos
- O backend foi atualizado para diferenciar Entradas (soma) de Saídas (subtração).
- Tipos de Saída suportados para desconto: `Perda`, `Uso Interno`, `Troca`, `Saída`, `Doação (Saída)`.

---
**Status:** ✅ Implementado e pronto para uso.
