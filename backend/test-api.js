// Script de prueba para verificar que la API funciona correctamente
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log(' Iniciando pruebas de la API...\n');

  try {
    // Test 1: Obtener todos los clientes
    console.log('1️ Probando GET /api/clientes...');
    const response1 = await fetch(`${API_BASE_URL}/clientes`);
    const clientes = await response1.json();
    console.log(` Clientes obtenidos: ${clientes.length}`);
    console.log(' Clientes:', clientes.map(c => ({ id: c.id, nombre: c.nombre, correo: c.correo })));
    console.log('');

    // Test 2: Crear un nuevo cliente
    console.log('2️ Probando POST /api/clientes...');
    const nuevoCliente = {
      nombre: 'Cliente de Prueba',
      correo: 'test@example.com',
      telefono: '809-123-4567'
    };
    
    const response2 = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoCliente)
    });
    
    if (response2.ok) {
      const clienteCreado = await response2.json();
      console.log(' Cliente creado exitosamente');
      console.log(' Cliente creado:', clienteCreado);
      console.log('');

      // Test 3: Actualizar el cliente
      console.log('3️ Probando PUT /api/clientes/:id...');
      const clienteActualizado = {
        nombre: 'Cliente de Prueba Actualizado',
        correo: 'test.updated@example.com',
        telefono: '809-987-6543'
      };
      
      const response3 = await fetch(`${API_BASE_URL}/clientes/${clienteCreado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteActualizado)
      });
      
      if (response3.ok) {
        const clienteModificado = await response3.json();
        console.log(' Cliente actualizado exitosamente');
        console.log(' Cliente actualizado:', clienteModificado);
        console.log('');

        // Test 4: Eliminar el cliente
        console.log('4️ Probando DELETE /api/clientes/:id...');
        const response4 = await fetch(`${API_BASE_URL}/clientes/${clienteCreado.id}`, {
          method: 'DELETE'
        });
        
        if (response4.ok) {
          console.log(' Cliente eliminado exitosamente');
        } else {
          console.log(' Error al eliminar cliente');
        }
      } else {
        console.log(' Error al actualizar cliente');
      }
    } else {
      console.log(' Error al crear cliente');
    }

  } catch (error) {
    console.error(' Error en las pruebas:', error.message);
  }

  console.log('\n Pruebas completadas');
}

// Ejecutar las pruebas si este archivo se ejecuta directamente
if (require.main === module) {
  testAPI();
}

module.exports = testAPI; 