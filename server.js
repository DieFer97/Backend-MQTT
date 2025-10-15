import { spawn } from 'child_process';
import 'dotenv/config';
import './src/lib/mqtt-init.ts';

// Inicializar cliente MQTT
console.log('Iniciando cliente MQTT...');

// Esperar un momento para que MQTT se conecte
setTimeout(() => {
  console.log('Iniciando servidor Next.js...');
  
  // Iniciar Next.js
  const nextServer = spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  nextServer.on('error', (error) => {
    console.error('Error al iniciar Next.js:', error);
    process.exit(1);
  });
}, 2000);