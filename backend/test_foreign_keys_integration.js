/**
 * Script de Teste: Verificar Integração após Migração de Foreign Keys
 * Execute com: node backend/test_foreign_keys_integration.js
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
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

async function testIntegration() {
    console.log('🧪 TESTE DE INTEGRAÇÃO - FOREIGN KEYS\n');
    console.log('═'.repeat(70));

    let allTestsPassed = true;

    try {
        // 1. Testar Setores
        console.log('\n📂 1. TESTANDO SETORES');
        console.log('─'.repeat(70));
        const sectorsResponse = await makeRequest('/api/inventory/sectors');

        if (sectorsResponse.status === 200) {
            console.log('✅ Setores carregados com sucesso');
            console.log(`   Total: ${sectorsResponse.data.length} setores`);

            if (sectorsResponse.data.length > 0) {
                const firstSector = sectorsResponse.data[0];
                console.log(`   Exemplo: ${firstSector.nome}`);
                console.log(`   - ID: ${firstSector.id}`);
                console.log(`   - Total Itens: ${firstSector.totalItens}`);
                console.log(`   - Responsável: ${firstSector.responsavel || 'N/A'}`);
            }
        } else {
            console.log('❌ Erro ao carregar setores');
            allTestsPassed = false;
        }

        // 2. Testar Categorias
        console.log('\n📁 2. TESTANDO CATEGORIAS');
        console.log('─'.repeat(70));
        const categoriesResponse = await makeRequest('/api/inventory/categories');

        if (categoriesResponse.status === 200) {
            console.log('✅ Categorias carregadas com sucesso');
            console.log(`   Total: ${categoriesResponse.data.length} categorias`);

            if (categoriesResponse.data.length > 0) {
                const firstCategory = categoriesResponse.data[0];
                console.log(`   Exemplo: ${firstCategory.nome}`);
                console.log(`   - ID: ${firstCategory.id}`);
                console.log(`   - Setor ID: ${firstCategory.setor_id || 'N/A'}`);

                // Verificar se setor_id existe (novo campo)
                if (firstCategory.hasOwnProperty('setor_id')) {
                    console.log('   ✅ Campo setor_id presente');
                } else {
                    console.log('   ❌ Campo setor_id AUSENTE');
                    allTestsPassed = false;
                }
            }
        } else {
            console.log('❌ Erro ao carregar categorias');
            allTestsPassed = false;
        }

        // 3. Testar Produtos
        console.log('\n📦 3. TESTANDO PRODUTOS');
        console.log('─'.repeat(70));
        const productsResponse = await makeRequest('/api/inventory/products');

        if (productsResponse.status === 200) {
            console.log('✅ Produtos carregados com sucesso');
            console.log(`   Total: ${productsResponse.data.length} produtos`);

            if (productsResponse.data.length > 0) {
                const firstProduct = productsResponse.data[0];
                console.log(`   Exemplo: ${firstProduct.nome}`);
                console.log(`   - ID: ${firstProduct.id}`);
                console.log(`   - Categoria ID: ${firstProduct.categoria_id || 'N/A'}`);
                console.log(`   - Setor ID: ${firstProduct.setor_id || 'N/A'}`);
                console.log(`   - Categoria Nome: ${firstProduct.categoria_nome || 'N/A'}`);

                // Verificar se campos UUID existem
                if (firstProduct.hasOwnProperty('categoria_id')) {
                    console.log('   ✅ Campo categoria_id presente');
                } else {
                    console.log('   ❌ Campo categoria_id AUSENTE');
                    allTestsPassed = false;
                }

                if (firstProduct.hasOwnProperty('setor_id')) {
                    console.log('   ✅ Campo setor_id presente');
                } else {
                    console.log('   ❌ Campo setor_id AUSENTE');
                    allTestsPassed = false;
                }
            }
        } else {
            console.log('❌ Erro ao carregar produtos');
            allTestsPassed = false;
        }

        // 4. Testar Lançamentos
        console.log('\n📋 4. TESTANDO LANÇAMENTOS');
        console.log('─'.repeat(70));
        const transactionsResponse = await makeRequest('/api/inventory/transactions');

        if (transactionsResponse.status === 200) {
            console.log('✅ Lançamentos carregados com sucesso');
            console.log(`   Total: ${transactionsResponse.data.length} lançamentos`);

            if (transactionsResponse.data.length > 0) {
                const firstTransaction = transactionsResponse.data[0];
                console.log(`   Exemplo: ${firstTransaction.tipo}`);
                console.log(`   - ID: ${firstTransaction.id}`);
                console.log(`   - Itens: ${firstTransaction.items?.length || 0}`);

                if (firstTransaction.items && firstTransaction.items.length > 0) {
                    const firstItem = firstTransaction.items[0];
                    console.log(`   - Primeiro Item:`);
                    console.log(`     - Setor ID: ${firstItem.setor_id || 'N/A'}`);
                    console.log(`     - Categoria ID: ${firstItem.categoria_id || 'N/A'}`);

                    // Verificar se campos UUID existem
                    if (firstItem.hasOwnProperty('setor_id')) {
                        console.log('     ✅ Campo setor_id presente em itens');
                    } else {
                        console.log('     ⚠️  Campo setor_id ausente em itens (pode ser NULL)');
                    }

                    if (firstItem.hasOwnProperty('categoria_id')) {
                        console.log('     ✅ Campo categoria_id presente em itens');
                    } else {
                        console.log('     ⚠️  Campo categoria_id ausente em itens (pode ser NULL)');
                    }
                }
            }
        } else {
            console.log('❌ Erro ao carregar lançamentos');
            allTestsPassed = false;
        }

        // 5. Verificar Integridade Referencial
        console.log('\n🔗 5. VERIFICANDO INTEGRIDADE REFERENCIAL');
        console.log('─'.repeat(70));

        if (productsResponse.status === 200 && categoriesResponse.status === 200 && sectorsResponse.status === 200) {
            const products = productsResponse.data;
            const categories = categoriesResponse.data;
            const sectors = sectorsResponse.data;

            // Criar maps para lookup rápido
            const categoryMap = new Map(categories.map(c => [c.id, c]));
            const sectorMap = new Map(sectors.map(s => [s.id, s]));

            let orphanProducts = 0;
            let orphanCategories = 0;

            // Verificar produtos órfãos
            products.forEach(product => {
                if (product.categoria_id && !categoryMap.has(product.categoria_id)) {
                    orphanProducts++;
                    console.log(`   ⚠️  Produto órfão: ${product.nome} (categoria_id: ${product.categoria_id})`);
                }
                if (product.setor_id && !sectorMap.has(product.setor_id)) {
                    orphanProducts++;
                    console.log(`   ⚠️  Produto órfão: ${product.nome} (setor_id: ${product.setor_id})`);
                }
            });

            // Verificar categorias órfãs
            categories.forEach(category => {
                if (category.setor_id && !sectorMap.has(category.setor_id)) {
                    orphanCategories++;
                    console.log(`   ⚠️  Categoria órfã: ${category.nome} (setor_id: ${category.setor_id})`);
                }
            });

            if (orphanProducts === 0 && orphanCategories === 0) {
                console.log('   ✅ Nenhum registro órfão encontrado');
                console.log('   ✅ Integridade referencial OK');
            } else {
                console.log(`   ⚠️  Encontrados ${orphanProducts} produtos órfãos`);
                console.log(`   ⚠️  Encontrados ${orphanCategories} categorias órfãs`);
                allTestsPassed = false;
            }
        }

        // 6. Resumo Final
        console.log('\n📊 6. RESUMO FINAL');
        console.log('═'.repeat(70));

        if (allTestsPassed) {
            console.log('✅ TODOS OS TESTES PASSARAM!');
            console.log('✅ Migração de Foreign Keys concluída com sucesso');
            console.log('✅ Sistema está funcionando corretamente');
        } else {
            console.log('❌ ALGUNS TESTES FALHARAM');
            console.log('⚠️  Verifique os erros acima');
            console.log('⚠️  Pode ser necessário executar migration_verification.sql');
        }

    } catch (error) {
        console.error('\n❌ ERRO DURANTE OS TESTES:', error.message);
        allTestsPassed = false;
    }

    console.log('\n' + '═'.repeat(70));
    console.log(`Status Final: ${allTestsPassed ? '✅ SUCESSO' : '❌ FALHA'}`);
    console.log('═'.repeat(70) + '\n');

    process.exit(allTestsPassed ? 0 : 1);
}

// Executar testes
testIntegration();
