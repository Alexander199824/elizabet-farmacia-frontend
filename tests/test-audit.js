/**
 * Test de Auditoría - Con Menú Interactivo
 * Autor: Alexander Echeverria
 * Ejecutar: node test-audit.js
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
const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

function printHeader(text) {
    console.clear();
    console.log('\n' + colors.cyan + '═'.repeat(70) + colors.reset);
    console.log(colors.cyan + '  ' + text + colors.reset);
    console.log(colors.cyan + '═'.repeat(70) + colors.reset + '\n');
}

const printSuccess = (msg) => console.log(colors.green + '✓ ' + msg + colors.reset);
const printError = (msg, e = null) => {
    console.log(colors.red + '✗ ' + msg + colors.reset);
    if (e?.response) console.log(colors.red + '  ' + JSON.stringify(e.response.data, null, 2) + colors.reset);
};
const printInfo = (msg) => console.log(colors.blue + 'ℹ ' + msg + colors.reset);
const printWarning = (msg) => console.log(colors.yellow + '⚠ ' + msg + colors.reset);

async function login() {
    printHeader('LOGIN');
    const email = await question('Email (admin@farmacia.com): ') || 'admin@farmacia.com';
    const password = await question('Password (Admin123!): ') || 'Admin123!';
    try {
        const res = await axios.post(`${API_URL}/users/login`, { email, password });
        authToken = res.data.token;
        printSuccess('Login exitoso!');
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getAllLogs() {
    printHeader('LISTAR LOGS DE AUDITORÍA');
    if (!authToken) { printWarning('Login requerido'); await question('\nEnter...'); return; }
    
    const page = await question('Página (1): ') || '1';
    const limit = await question('Límite (20): ') || '20';
    const action = await question('Acción (CREATE/UPDATE/DELETE/LOGIN, opcional): ') || '';
    const entity = await question('Entidad (User/Product/Invoice, opcional): ') || '';
    
    try {
        let url = `${API_URL}/audit/logs?page=${page}&limit=${limit}`;
        if (action) url += `&action=${action}`;
        if (entity) url += `&entity=${entity}`;
        
        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Total de logs: ${res.data.total}`);
        printInfo(`Página ${res.data.page}/${res.data.totalPages}`);
        
        console.log('\n' + colors.yellow + 'LOGS DE AUDITORÍA:' + colors.reset);
        console.log(colors.yellow + '-'.repeat(80) + colors.reset);
        
        res.data.logs.forEach((log, i) => {
            const date = new Date(log.createdAt).toLocaleString();
            console.log(`\n${colors.cyan}${i + 1}. [${log.action}] ${log.entity}${colors.reset}`);
            console.log(`   Usuario: ${log.user?.username || 'N/A'}`);
            console.log(`   Descripción: ${log.description || 'N/A'}`);
            console.log(`   IP: ${log.ipAddress || 'N/A'}`);
            console.log(`   Fecha: ${date}`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getLogById() {
    printHeader('OBTENER LOG POR ID');
    if (!authToken) { printWarning('Login requerido'); await question('\nEnter...'); return; }
    
    const logId = await question('ID del log: ');
    
    try {
        const res = await axios.get(`${API_URL}/audit/logs/${logId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const log = res.data;
        
        console.log('\n' + colors.green + 'DETALLE DEL LOG:' + colors.reset);
        console.log(colors.green + '-'.repeat(60) + colors.reset);
        console.log(`ID: ${log.id}`);
        console.log(`Acción: ${log.action}`);
        console.log(`Entidad: ${log.entity}`);
        console.log(`ID Entidad: ${log.entityId || 'N/A'}`);
        console.log(`Usuario: ${log.user?.username || 'N/A'} (ID: ${log.userId || 'N/A'})`);
        console.log(`Descripción: ${log.description || 'N/A'}`);
        console.log(`IP: ${log.ipAddress || 'N/A'}`);
        console.log(`User Agent: ${log.userAgent || 'N/A'}`);
        console.log(`Fecha: ${new Date(log.createdAt).toLocaleString()}`);
        
        if (log.previousValue) {
            console.log('\n' + colors.yellow + 'Valor anterior:' + colors.reset);
            console.log(JSON.stringify(log.previousValue, null, 2));
        }
        
        if (log.newValue) {
            console.log('\n' + colors.cyan + 'Valor nuevo:' + colors.reset);
            console.log(JSON.stringify(log.newValue, null, 2));
        }
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getLogsByUser() {
    printHeader('LOGS POR USUARIO');
    if (!authToken) { printWarning('Login requerido'); await question('\nEnter...'); return; }
    
    const userId = await question('ID del usuario: ');
    const limit = await question('Límite (20): ') || '20';
    
    try {
        const res = await axios.get(`${API_URL}/audit/logs/user/${userId}?limit=${limit}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Logs del usuario: ${res.data.length}`);
        
        res.data.forEach((log, i) => {
            console.log(`\n${i + 1}. [${log.action}] ${log.entity}`);
            console.log(`   ${log.description}`);
            console.log(`   ${new Date(log.createdAt).toLocaleString()}`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getLogsByEntity() {
    printHeader('LOGS POR ENTIDAD');
    if (!authToken) { printWarning('Login requerido'); await question('\nEnter...'); return; }
    
    const entity = await question('Entidad (User/Product/Invoice/etc): ');
    const entityId = await question('ID de la entidad (opcional): ') || '';
    const limit = await question('Límite (20): ') || '20';
    
    try {
        let url = `${API_URL}/audit/logs/entity/${entity}`;
        if (entityId) url += `/${entityId}`;
        url += `?limit=${limit}`;
        
        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Logs encontrados: ${res.data.length}`);
        
        res.data.forEach((log, i) => {
            console.log(`\n${i + 1}. [${log.action}]`);
            console.log(`   Usuario: ${log.user?.username || 'N/A'}`);
            console.log(`   ${log.description}`);
            console.log(`   ${new Date(log.createdAt).toLocaleString()}`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getAuditStats() {
    printHeader('ESTADÍSTICAS DE AUDITORÍA');
    if (!authToken) { printWarning('Login requerido'); await question('\nEnter...'); return; }
    
    const startDate = await question('Fecha inicio (YYYY-MM-DD, opcional): ') || '';
    const endDate = await question('Fecha fin (YYYY-MM-DD, opcional): ') || '';
    
    try {
        let url = `${API_URL}/audit/stats`;
        if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
        
        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const s = res.data;
        
        console.log('\n' + colors.green + 'ESTADÍSTICAS:' + colors.reset);
        console.log(`Total de logs: ${s.totalLogs}`);
        console.log(`Eventos críticos: ${s.criticalEvents}`);
        console.log(`Acciones fallidas: ${s.failedActions}`);
        
        console.log('\n' + colors.cyan + 'Por acción:' + colors.reset);
        s.byAction.forEach(action => {
            console.log(`  ${action.action}: ${action.count}`);
        });
        
        console.log('\n' + colors.yellow + 'Usuarios más activos:' + colors.reset);
        s.topUsers.slice(0, 5).forEach((u, i) => {
            console.log(`  ${i + 1}. ${u.user?.username || 'N/A'}: ${u.count} acciones`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function getRecentActivity() {
    printHeader('ACTIVIDAD RECIENTE');
    if (!authToken) { printWarning('Login requerido'); await question('\nEnter...'); return; }
    
    const hours = await question('Últimas horas (24): ') || '24';
    const limit = await question('Límite (50): ') || '50';
    
    try {
        const res = await axios.get(`${API_URL}/audit/recent?hours=${hours}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        printSuccess(`Actividad de las últimas ${hours} horas: ${res.data.count} eventos`);
        
        res.data.logs.forEach((log, i) => {
            const timeAgo = Math.floor((Date.now() - new Date(log.createdAt)) / 60000);
            console.log(`\n${i + 1}. [${log.action}] ${log.entity}`);
            console.log(`   Usuario: ${log.user?.username || 'N/A'}`);
            console.log(`   Hace ${timeAgo} minuto(s)`);
        });
        
        await question('\nEnter...');
    } catch (error) {
        printError('Error', error);
        await question('\nEnter...');
    }
}

async function showMenu() {
    printHeader('TEST DE AUDITORÍA - FARMACIA ELIZABETH');
    console.log(authToken ? colors.green + '  ✓ Autenticado' : colors.red + '  ✗ No autenticado');
    console.log(colors.reset + '\n' + colors.yellow + '  OPCIONES:' + colors.reset);
    console.log('  1.  Login');
    console.log('  2.  Listar todos los logs');
    console.log('  3.  Obtener log por ID');
    console.log('  4.  Logs por usuario');
    console.log('  5.  Logs por entidad');
    console.log('  6.  Estadísticas de auditoría');
    console.log('  7.  Actividad reciente');
    console.log('  0.  Salir');
    
    const opt = await question('\n  Selecciona: ');
    
    switch (opt) {
        case '1': await login(); break;
        case '2': await getAllLogs(); break;
        case '3': await getLogById(); break;
        case '4': await getLogsByUser(); break;
        case '5': await getLogsByEntity(); break;
        case '6': await getAuditStats(); break;
        case '7': await getRecentActivity(); break;
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
    console.log('║       TEST DE AUDITORÍA - FARMACIA ELIZABETH              ║');
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