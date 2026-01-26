/**
 * Script de teste para verificar a API de setores
 */

const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/inventory/sectors',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('🧪 Testando API de Setores...\n');
console.log(`📡 GET ${options.hostname}:${options.port}${options.path}\n`);

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log(`📋 Headers:`, res.headers);
        console.log('\n📦 Response:\n');

        try {
            const jsonData = JSON.parse(data);
            console.log(JSON.stringify(jsonData, null, 2));

            console.log('\n📊 Análise dos Dados:\n');
            console.log(`Total de setores: ${jsonData.length}`);

            if (jsonData.length > 0) {
                const firstSector = jsonData[0];
                console.log('\n🔍 Primeiro setor:');
                console.log(`  - ID: ${firstSector.id}`);
                console.log(`  - Nome: ${firstSector.nome}`);
                console.log(`  - Responsável: ${firstSector.responsavel || 'Não definido'}`);
                console.log(`  - Localização: ${firstSector.localizacao || 'Não definido'}`);
                console.log(`  - Status: ${firstSector.status || 'Não definido'}`);
                console.log(`  - Total de Itens: ${firstSector.totalItens}`);

                // Verificar se todos os campos necessários existem
                const requiredFields = ['id', 'nome', 'responsavel', 'localizacao', 'status', 'totalItens'];
                const missingFields = requiredFields.filter(field => !(field in firstSector));

                if (missingFields.length > 0) {
                    console.log(`\n⚠️  Campos faltando: ${missingFields.join(', ')}`);
                } else {
                    console.log('\n✅ Todos os campos necessários estão presentes!');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao parsear JSON:', error.message);
            console.log('Raw data:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    console.log('\n⚠️  Verifique se o servidor está rodando na porta 3001');
});

req.end();
