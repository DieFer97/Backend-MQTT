import { spawn } from 'child_process';
import 'dotenv/config';
import { mqttClient } from './src/lib/mqtt-client';

console.log('Iniciando cliente MQTT...');

mqttClient.connect();

setTimeout(() => {
  console.log('Iniciando servidor Next.js...');
  
  const nextServer = spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  nextServer.on('error', (error) => {
    console.error('Error al iniciar Next.js:', error);
    process.exit(1);
  });
}, 2000);