import { mqttClient } from './mqtt-client';

if (typeof window === 'undefined') {
  console.log('[MQTT Init] Inicializando cliente MQTT en el servidor...');
}

export { mqttClient };
