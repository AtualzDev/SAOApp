/**
 * Script para verificar a conexão entre Setores, Produtos e Lançamentos
 */

const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function analyzeConnections() {
    console.log('🔍 Analisando Conexões entre Setores, Produtos e Lançamentos\n');
    console.log('═'.repeat(70));

    try {
        // 1. Buscar Setores
        console.log('\n📂 1. SETORES');
        console.log('─'.repeat(70));
        const sectors = await makeRequest('/api/inventory/sectors');
        console.log(`Total de setores: ${sectors.length}`);

        sectors.forEach((sector, index) => {
            console.log(`\n  ${index + 1}. ${sector.nome}`);
            console.log(`     ID: ${sector.id}`);
            console.log(`     Responsável: ${sector.responsavel || 'Não definido'}`);
            console.log(`     Localização: ${sector.localizacao || 'Não definido'}`);
            console.log(`     Status: ${sector.status}`);
            console.log(`     Total de Itens: ${sector.totalItens}`);
        });

        // 2. Buscar Produtos
        console.log('\n\n📦 2. PRODUTOS');
        console.log('─'.repeat(70));
        const products = await makeRequest('/api/inventory/products');
        console.log(`Total de produtos: ${products.length}`);

        // Agrupar produtos por setor
        const productsBySector = {};
        products.forEach(product => {
            const sectorId = product.setor || 'sem-setor';
            if (!productsBySector[sectorId]) {
                productsBySector[sectorId] = [];
            }
            productsBySector[sectorId].push(product);
        });

        console.log('\n  Produtos por Setor:');
        Object.entries(productsBySector).forEach(([sectorId, prods]) => {
            const sector = sectors.find(s => s.id === sectorId);
            const sectorName = sector ? sector.nome : 'Sem Setor';
            console.log(`    - ${sectorName}: ${prods.length} produto(s)`);
        });

        // 3. Buscar Lançamentos
        console.log('\n\n📋 3. LANÇAMENTOS');
        console.log('─'.repeat(70));
        const transactions = await makeRequest('/api/inventory/transactions');
        console.log(`Total de lançamentos: ${transactions.length}`);

        if (transactions.length > 0) {
            console.log('\n  Últimos 3 lançamentos:');
            transactions.slice(0, 3).forEach((trans, index) => {
                console.log(`\n    ${index + 1}. ${trans.tipo} - ${trans.status}`);
                console.log(`       Data: ${new Date(trans.created_at).toLocaleDateString('pt-BR')}`);
                console.log(`       Valor Total: R$ ${trans.valor_total?.toFixed(2) || '0.00'}`);
                console.log(`       Itens: ${trans.items?.length || 0}`);
            });
        }

        // 4. Análise de Conectividade
        console.log('\n\n🔗 4. ANÁLISE DE CONECTIVIDADE');
        console.log('─'.repeat(70));

        // Verificar se há produtos sem setor
        const productsWithoutSector = products.filter(p => !p.setor);
        console.log(`\n  ✓ Produtos sem setor: ${productsWithoutSector.length}`);

        // Verificar se há setores sem produtos
        const sectorsWithoutProducts = sectors.filter(s => s.totalItens === 0);
        console.log(`  ✓ Setores sem produtos: ${sectorsWithoutProducts.length}`);

        // Verificar consistência
        let inconsistencies = 0;
        sectors.forEach(sector => {
            const productsInSector = products.filter(p => p.setor === sector.id).length;
            if (productsInSector !== sector.totalItens) {
                console.log(`  ⚠️  Inconsistência: ${sector.nome} - API diz ${sector.totalItens}, mas há ${productsInSector} produtos`);
                inconsistencies++;
            }
        });

        if (inconsistencies === 0) {
            console.log(`  ✅ Contagem de produtos por setor está consistente!`);
        }

        // 5. Resumo Final
        console.log('\n\n📊 5. RESUMO FINAL');
        console.log('═'.repeat(70));
        console.log(`  Total de Setores: ${sectors.length}`);
        console.log(`  Total de Produtos: ${products.length}`);
        console.log(`  Total de Lançamentos: ${transactions.length}`);
        console.log(`  Setores Ativos: ${sectors.filter(s => s.status === 'Ativo').length}`);
        console.log(`  Produtos com Setor: ${products.filter(p => p.setor).length}`);
        console.log(`  Produtos sem Setor: ${productsWithoutSector.length}`);

        console.log('\n✅ Análise concluída com sucesso!\n');

    } catch (error) {
        console.error('\n❌ Erro durante a análise:', error.message);
    }
}

// Executar
analyzeConnections();
