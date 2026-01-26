/**
 * Script para executar a migration de adição de campos aos setores
 * Execute com: node backend/database/run_sector_migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: SUPABASE_URL ou SUPABASE_ANON_KEY não encontrados no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🚀 Iniciando migration de setores...\n');

    try {
        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, 'add_sector_fields.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 Arquivo SQL carregado:', sqlPath);
        console.log('📝 Conteúdo da migration:\n');
        console.log('─'.repeat(60));
        console.log(sqlContent.substring(0, 500) + '...');
        console.log('─'.repeat(60));
        console.log('\n⚠️  ATENÇÃO: Esta migration será executada via Supabase RPC.');
        console.log('⚠️  Para migrations complexas, recomenda-se executar diretamente no SQL Editor do Supabase.\n');

        // Executar as queries individualmente
        const queries = sqlContent
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--') && !q.startsWith('COMMENT'));

        console.log(`📊 Total de queries a executar: ${queries.length}\n`);

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            if (query.includes('ALTER TABLE') || query.includes('UPDATE') || query.includes('CREATE INDEX')) {
                console.log(`\n[${i + 1}/${queries.length}] Executando query...`);
                console.log('Query:', query.substring(0, 100) + '...');

                // Nota: O Supabase client não suporta DDL diretamente via JS
                // Esta é uma limitação conhecida
                console.log('⚠️  Esta query precisa ser executada manualmente no SQL Editor do Supabase');
            }
        }

        console.log('\n\n📋 INSTRUÇÕES PARA EXECUTAR A MIGRATION:\n');
        console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Selecione seu projeto');
        console.log('3. Vá em "SQL Editor" no menu lateral');
        console.log('4. Crie uma nova query');
        console.log('5. Cole o conteúdo do arquivo: backend/database/add_sector_fields.sql');
        console.log('6. Execute a query (botão "Run" ou Ctrl+Enter)');
        console.log('\n✅ Após executar, os novos campos estarão disponíveis!\n');

        // Verificar se a tabela setores existe
        console.log('🔍 Verificando estrutura atual da tabela setores...\n');
        const { data, error } = await supabase
            .from('setores')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Erro ao verificar tabela:', error.message);
        } else {
            console.log('✅ Tabela setores encontrada!');
            if (data && data.length > 0) {
                console.log('📊 Campos atuais:', Object.keys(data[0]).join(', '));

                // Verificar se os novos campos já existem
                if (data[0].hasOwnProperty('responsavel')) {
                    console.log('\n✅ Campo "responsavel" já existe!');
                } else {
                    console.log('\n⚠️  Campo "responsavel" ainda não existe - execute a migration');
                }

                if (data[0].hasOwnProperty('localizacao')) {
                    console.log('✅ Campo "localizacao" já existe!');
                } else {
                    console.log('⚠️  Campo "localizacao" ainda não existe - execute a migration');
                }

                if (data[0].hasOwnProperty('status')) {
                    console.log('✅ Campo "status" já existe!');
                } else {
                    console.log('⚠️  Campo "status" ainda não existe - execute a migration');
                }
            } else {
                console.log('⚠️  Tabela setores está vazia');
            }
        }

    } catch (error) {
        console.error('\n❌ Erro durante a migration:', error);
        process.exit(1);
    }
}

// Executar
runMigration()
    .then(() => {
        console.log('\n✅ Script finalizado com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erro fatal:', error);
        process.exit(1);
    });
