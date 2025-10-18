/**
 * Test Completo de Lotes - Con Menú Interactivo
 * Autor: Alexander Echeverria
 * Ubicación: tests/test-batches.js
 * 
 * Ejecutar: node test-batches.js
 */

require('dotenv').config();
const axios = require('axios');
const readline = require('readline');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

let authToken = null;

const colors = {
    reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m',
    yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', magenta: '\x1b[35m'
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function question(prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
}

function printHeader(text) {
    console.clear();
    console.log('\n' + colors.cyan + '═'.repeat(70) + colors.reset);
    console.log(colors.cyan + '  ' + text + colors.reset);
    console.log(colors.cyan + '═'.repeat(70) + colors.reset + '\n');
}

function printSuccess(msg) { console.log(colors.green + '✓ ' + msg + colors.reset); }
function printError(msg, error = null) {
    console.log(colors.red + '✗ ' + msg + colors.reset);
    if (error?.response) {
        console.log(colors.red + '  Status: ' + error.response.status + colors.reset);
        console.log(colors.red + '  ' + JSON.stringify(error.response.data, null, 2) + colors.reset);
    }
}
function printInfo(msg) { console.log(colors.blue + 'ℹ ' + msg + colors.reset); }
function printWarning(msg) { console.log(colors.yellow + '⚠ ' + msg + colors.reset); }

// ========== AUTH ==========

async function login() {
    printHeader('LOGIN');
    const email = await question('Email (admin@farmacia.com): ') || 'admin@farmacia.com';
    const password = await question('Password (Admin123!): ') || 'Admin123!';
    
    try {
        const response = await axios.post(`${API_URL}/users/login`, { email, password });
        authToken = response.data.token;
        printSuccess('Login exitoso!');
        await question('\nEnter...');
    } catch (error) {
        printError('Error en login', error);
        await question('\nEnter...');
    }
}

// ========== LOTES ==========

async function createBatch() {
    printHeader('CREAR NUEVO LOTE');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    const productId = await question('ID del producto: ');
    const supplierId = await question('ID del proveedor: ');
    const batchNumber = await question(`Número de lote (LOTE-${Date.now()}): `) || `LOTE-${Date.now()}`;
    const manufacturingDate = await question('Fecha fabricación (YYYY-MM-DD): ');
    const expirationDate = await question('Fecha vencimiento (YYYY-MM-DD): ');
    const initialQuantity = await question('Cantidad inicial: ');
    const purchasePrice = await question('Precio compra unitario: ');
    const salePrice = await question('Precio venta unitario: ');
    const location = await question('Ubicación (ej: ESTANTE-A1): ') || null;
    
    try {
        const response = await axios.post(`${API_URL}/batches`, {
            productId, supplierId, batchNumber, manufacturingDate, expirationDate,
            initialQuantity: parseInt(initialQuantity),
            purchasePrice: parseFloat(purchasePrice),
            salePrice: parseFloat(salePrice),
            location
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess('Lote creado!');
        printInfo(`ID: ${response.data.batch.id}`);
        printInfo(`Número: ${response.data.batch.batchNumber}`);
        printInfo(`Estado: ${response.data.batch.status}`);
        printInfo(`Cantidad: ${response.data.batch.currentQuantity}`);
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error al crear lote', error);
        await question('\nEnter...');
    }
}

async function listBatches() {
    printHeader('LISTAR LOTES');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    const page = await question('Página (1): ') || '1';
    const limit = await question('Límite (10): ') || '10';
    const status = await question('Estado (opcional): ') || '';
    
    try {
        let url = `${API_URL}/batches?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Total: ${response.data.total}`);
        printInfo(`Página ${response.data.page}/${response.data.totalPages}`);
        
        console.log('\n' + colors.yellow + 'LISTADO:' + colors.reset);
        console.log(colors.yellow + '-'.repeat(80) + colors.reset);
        
        response.data.batches.forEach((batch, i) => {
            console.log(`\n${colors.cyan}${i + 1}. Lote ${batch.batchNumber}${colors.reset}`);
            console.log(`   ID: ${batch.id}`);
            console.log(`   Producto: ${batch.product?.name || 'N/A'}`);
            console.log(`   Vencimiento: ${batch.expirationDate}`);
            console.log(`   Cantidad: ${batch.currentQuantity}/${batch.initialQuantity}`);
            console.log(`   Estado: ${batch.status}`);
            console.log(`   Puede venderse: ${batch.canBeSold ? '✓' : '✗'}`);
            console.log(`   Ubicación: ${batch.location || 'N/A'}`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error al listar', error);
        await question('\nEnter...');
    }
}

async function getBatchById() {
    printHeader('OBTENER LOTE POR ID');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    const batchId = await question('ID del lote: ');
    
    try {
        const response = await axios.get(`${API_URL}/batches/${batchId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const b = response.data;
        
        console.log('\n' + colors.green + 'INFO DEL LOTE:' + colors.reset);
        console.log(colors.green + '-'.repeat(60) + colors.reset);
        console.log(`ID: ${b.id}`);
        console.log(`Número: ${b.batchNumber}`);
        console.log(`Producto: ${b.product?.name || 'N/A'}`);
        console.log(`Proveedor: ${b.supplier?.name || 'N/A'}`);
        console.log(`Fabricación: ${b.manufacturingDate}`);
        console.log(`Vencimiento: ${b.expirationDate}`);
        console.log(`Cantidad inicial: ${b.initialQuantity}`);
        console.log(`Cantidad actual: ${b.currentQuantity}`);
        console.log(`Precio compra: Q${b.purchasePrice}`);
        console.log(`Precio venta: Q${b.salePrice}`);
        console.log(`Estado: ${b.status}`);
        console.log(`Puede venderse: ${b.canBeSold ? 'Sí' : 'No'}`);
        console.log(`Ubicación: ${b.location || 'N/A'}`);
        console.log(`Recepción: ${b.receiptDate}`);
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error al obtener lote', error);
        await question('\nEnter...');
    }
}

async function updateBatch() {
    printHeader('ACTUALIZAR LOTE');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    const batchId = await question('ID del lote: ');
    
    console.log('\n' + colors.blue + 'Nuevos valores (Enter = sin cambio):' + colors.reset);
    
    const location = await question('Ubicación: ');
    const notes = await question('Notas: ');
    
    const updateData = {};
    if (location) updateData.location = location;
    if (notes) updateData.notes = notes;
    
    if (Object.keys(updateData).length === 0) {
        printWarning('Sin cambios');
        await question('\nEnter...');
        return;
    }
    
    try {
        const response = await axios.put(`${API_URL}/batches/${batchId}`, updateData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess('Lote actualizado!');
        printInfo(`Ubicación: ${response.data.batch.location || 'N/A'}`);
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error al actualizar', error);
        await question('\nEnter...');
    }
}

async function toggleBlockBatch() {
    printHeader('BLOQUEAR/DESBLOQUEAR LOTE');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    const batchId = await question('ID del lote: ');
    const reason = await question('Razón: ');
    
    try {
        const response = await axios.patch(`${API_URL}/batches/${batchId}/toggle-block`, { reason }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess('Estado cambiado!');
        printInfo(`Estado: ${response.data.batch.status}`);
        printInfo(`Puede venderse: ${response.data.batch.canBeSold ? 'Sí' : 'No'}`);
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getExpiringBatches() {
    printHeader('LOTES POR VENCER');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    const days = await question('Días (30): ') || '30';
    
    try {
        const response = await axios.get(`${API_URL}/batches/expiring?days=${days}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Lotes por vencer en ${days} días: ${response.data.count}`);
        
        response.data.batches.forEach((b, i) => {
            const daysLeft = Math.floor((new Date(b.expirationDate) - new Date()) / (1000*60*60*24));
            console.log(`\n${i + 1}. ${b.product?.name || 'N/A'}`);
            console.log(`   Lote: ${b.batchNumber}`);
            console.log(`   Vence en: ${daysLeft} días (${b.expirationDate})`);
            console.log(`   Cantidad: ${b.currentQuantity}`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getExpiredBatches() {
    printHeader('LOTES VENCIDOS');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    try {
        const response = await axios.get(`${API_URL}/batches/expired`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Lotes vencidos: ${response.data.count}`);
        printWarning(`Pérdida estimada: Q${response.data.totalLoss}`);
        
        response.data.batches.forEach((b, i) => {
            console.log(`\n${i + 1}. ${b.product?.name || 'N/A'}`);
            console.log(`   Lote: ${b.batchNumber}`);
            console.log(`   Vencido: ${b.expirationDate}`);
            console.log(`   Cantidad: ${b.currentQuantity}`);
            console.log(`   Pérdida: Q${b.purchasePrice * b.currentQuantity}`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getBatchStats() {
    printHeader('ESTADÍSTICAS DE LOTES');
    
    if (!authToken) {
        printWarning('Login requerido');
        await question('\nEnter...');
        return;
    }
    
    try {
        const response = await axios.get(`${API_URL}/batches/stats`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const s = response.data;
        
        console.log('\n' + colors.green + 'ESTADÍSTICAS:' + colors.reset);
        console.log(`Total: ${s.total}`);
        console.log(`Activos: ${s.active}`);
        console.log(`Por vencer: ${s.nearExpiry}`);
        console.log(`Vencidos: ${s.expired}`);
        console.log(`Agotados: ${s.depleted}`);
        console.log(`Bloqueados: ${s.blocked}`);
        console.log(`Valor total: Q${s.totalValue}`);
        console.log(`Cantidad total: ${s.totalQuantity}`);
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

// ========== MENÚ ==========

async function showMenu() {
    printHeader('TEST DE LOTES - FARMACIA ELIZABETH');
    
    console.log(colors.cyan + '  Estado:' + colors.reset);
    console.log(authToken ? colors.green + '  ✓ Autenticado' : colors.red + '  ✗ No autenticado');
    console.log(colors.reset);
    
    console.log('\n' + colors.yellow + '  OPCIONES:' + colors.reset);
    console.log('  1.  Login');
    console.log('  2.  Crear lote');
    console.log('  3.  Listar lotes');
    console.log('  4.  Obtener lote por ID');
    console.log('  5.  Actualizar lote');
    console.log('  6.  Bloquear/Desbloquear lote');
    console.log('  7.  Lotes por vencer');
    console.log('  8.  Lotes vencidos');
    console.log('  9.  Estadísticas');
    console.log('  0.  Salir');
    
    const option = await question('\n  Selecciona: ');
    
    switch (option) {
        case '1': await login(); break;
        case '2': await createBatch(); break;
        case '3': await listBatches(); break;
        case '4': await getBatchById(); break;
        case '5': await updateBatch(); break;
        case '6': await toggleBlockBatch(); break;
        case '7': await getExpiringBatches(); break;
        case '8': await getExpiredBatches(); break;
        case '9': await getBatchStats(); break;
        case '0':
            console.log('\n' + colors.green + '¡Hasta luego!' + colors.reset + '\n');
            rl.close();
            process.exit(0);
        default:
            printWarning('Opción no válida');
            await question('\nEnter...');
    }
    
    await showMenu();
}

async function init() {
    console.log(colors.magenta);
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║       TEST DE LOTES - FARMACIA ELIZABETH                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    printInfo(`Servidor: ${BASE_URL}`);
    await question('\nEnter para comenzar...');
    await showMenu();
}

init().catch(error => {
    console.error(colors.red + 'Error fatal:' + colors.reset, error);
    rl.close();
    process.exit(1);
});