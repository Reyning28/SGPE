#!/usr/bin/env node

const http = require('http');

console.log('🔍 Verificando si el backend está ejecutándose...\n');

// Función para verificar el backend
function testBackend() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: response,
                        headers: res.headers
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout: El servidor no respondió en 5 segundos'));
        });

        req.end();
    });
}

// Ejecutar la verificación
async function runTest() {
    try {
        console.log('🌐 Intentando conectar a http://localhost:3000/api...');
        const result = await testBackend();
        
        console.log('✅ Backend está ejecutándose correctamente!');
        console.log(`📊 Status: ${result.status}`);
        console.log('📄 Respuesta del servidor:');
        console.log(JSON.stringify(result.data, null, 2));
        
        if (result.data && result.data.endpoints) {
            console.log('\n🔌 Endpoints disponibles:');
            Object.entries(result.data.endpoints).forEach(([name, path]) => {
                console.log(`   ${name}: ${path}`);
            });
        }
        
        console.log('\n🎉 El backend está funcionando correctamente!');
        console.log('💡 Ahora puedes usar el frontend sin problemas.');
        
    } catch (error) {
        console.error('❌ Error conectando con el backend:');
        console.error(`   ${error.message}`);
        
        console.log('\n🔧 Soluciones posibles:');
        console.log('1. Verifica que el backend esté ejecutándose:');
        console.log('   cd backend && npm run dev');
        console.log('');
        console.log('2. Verifica que el puerto 3000 esté disponible');
        console.log('');
        console.log('3. Si usas un puerto diferente, actualiza la configuración');
        console.log('');
        console.log('4. Verifica que no haya errores en la consola del backend');
    }
}

// Ejecutar el test
runTest(); 