const port = 3001;
const baseUrl = `http://localhost:${port}/api/inventory`;

async function runTests() {
    try {
        console.log('--- Starting API Flow Tests ---');

        // 0. Prerequisites: Get a product and unit
        console.log('Fetching prerequisites...');
        const productsParams = await fetch(`${baseUrl}/products`).then(r => r.json());
        if (!productsParams || productsParams.length === 0) throw new Error('No products found to test with');
        const testProduct = productsParams[0];
        console.log('Test Product:', testProduct.nome, testProduct.id);

        const unitsParams = await fetch(`${baseUrl}/units`).then(r => r.json());
        const testUnit = unitsParams.length > 0 ? unitsParams[0].nome : 'Unit Test';

        // --- TEST ENTRIES ---
        console.log('\n--- TESTING ENTRIES (Lançamentos) ---');

        // 1. Create Entry
        const entryPayload = {
            type: 'Compra',
            status: 'Com nota',
            emissionDate: new Date().toISOString(),
            receptionDate: new Date().toISOString(),
            provider: 'Test Provider',
            unit: testUnit,
            noteNumber: '12345',
            notes: 'Automated Test Entry',
            items: [
                {
                    productId: testProduct.id,
                    quantity: 10,
                    unitPrice: 10.50,
                    unit: 'UN'
                }
            ]
        };

        const createEntryRes = await fetch(`${baseUrl}/entries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entryPayload)
        });
        const createEntryData = await createEntryRes.json();
        console.log('Create Entry Response:', createEntryRes.status, createEntryData);
        if (!createEntryRes.ok) throw new Error('Failed to create entry');
        const entryId = createEntryData.id;

        // 2. Get Entry
        const getEntryRes = await fetch(`${baseUrl}/entries/${entryId}`);
        const getEntryData = await getEntryRes.json();
        console.log('Get Entry Response:', getEntryRes.status, getEntryData.id === entryId ? 'OK' : 'Mismatch');

        // 3. Update Entry
        const updateEntryPayload = { ...entryPayload, notes: 'Updated Test Entry' };
        const updateEntryRes = await fetch(`${baseUrl}/entries/${entryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateEntryPayload)
        });
        console.log('Update Entry Response:', updateEntryRes.status);

        // 4. Delete Entry
        const deleteEntryRes = await fetch(`${baseUrl}/entries/${entryId}`, {
            method: 'DELETE'
        });
        console.log('Delete Entry Response:', deleteEntryRes.status);


        // --- TEST EXITS ---
        console.log('\n--- TESTING EXITS (Saídas) ---');

        // 1. Create Exit
        const exitPayload = {
            type: 'Uso Interno',
            status: 'Concluído',
            receptionDate: new Date().toISOString(),
            provider: 'Test Requester',
            unit: testUnit, // destino
            notes: 'Automated Test Exit',
            items: [
                {
                    productId: testProduct.id,
                    quantity: 1,
                    unit: 'UN'
                }
            ]
        };

        const createExitRes = await fetch(`${baseUrl}/exits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exitPayload)
        });
        const createExitData = await createExitRes.json();
        console.log('Create Exit Response:', createExitRes.status, createExitData);
        if (!createExitRes.ok) throw new Error('Failed to create exit: ' + JSON.stringify(createExitData));
        const exitId = createExitData.id;

        // 2. Get Exit
        const getExitRes = await fetch(`${baseUrl}/exits/${exitId}`);
        const getExitData = await getExitRes.json();
        console.log('Get Exit Response:', getExitRes.status, getExitData.id === exitId ? 'OK' : 'Mismatch');

        // 3. Update Exit
        const updateExitPayload = { ...exitPayload, notes: 'Updated Test Exit' };
        const updateExitRes = await fetch(`${baseUrl}/exits/${exitId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateExitPayload)
        });
        console.log('Update Exit Response:', updateExitRes.status);

        // 4. Delete Exit
        const deleteExitRes = await fetch(`${baseUrl}/exits/${exitId}`, {
            method: 'DELETE'
        });
        console.log('Delete Exit Response:', deleteExitRes.status);

        console.log('\n--- ALL TESTS PASSED ---');

    } catch (error) {
        console.error('TEST FAILED:', error);
    }
}

runTests();
