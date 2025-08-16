import "dotenv/config";
import mqtt from "mqtt";
import { prisma } from "./prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SensorMessage {
  temperature: number;
  lightLevel?: number;
  isAlarm?: boolean;
  timestamp?: string | number;
}

class MQTTClient {
  private client: mqtt.MqttClient | null = null;

  private readonly config = {
    broker: process.env.MQTT_BROKER || "broker.hivemq.com",
    port: parseInt(process.env.MQTT_PORT || "1883"),
    topic: "iot/sensor/data",
  };

  connect() {
    console.log("[v0] Conectando a MQTT broker...");
    this.client = mqtt.connect(`mqtt://${this.config.broker}:${this.config.port}`, {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 5000,
    });

    this.client.on("connect", () => {
      console.log("[v0] Conectado a MQTT broker");
      this.subscribe();
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(topic, message);
    });

    this.client.on("error", (error) => {
      console.error("[v0] Error MQTT:", error);
    });

    this.client.on("close", () => {
      console.log("[v0] Conexión MQTT cerrada");
    });
  }

  private subscribe() {
    if (!this.client) return;
    this.client.subscribe(this.config.topic, { qos: 1 }, (err) => {
      if (err) {
        console.error("[v0] Error suscribiéndose al tópico:", err);
      } else {
        console.log(`[v0] Suscrito al tópico: ${this.config.topic}`);
      }
    });
  }

  private async handleMessage(topic: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString());
      console.log("[v0] Mensaje recibido:", data);

      if (typeof data.temperature !== "number") {
        throw new Error("El campo temperature debe ser un número");
      }

      const sensorData = await prisma.sensorData.create({
        data: {
          temperature: Number(data.temperature),
          lightLevel: data.lightLevel !== undefined ? Number(data.lightLevel) : 0,
          isAlarm: data.isAlarm !== undefined ? Boolean(data.isAlarm) : false,
        },
      });
      console.log("[v0] Datos guardados en DB:", sensorData.id);
    } catch (error) {
      console.error("[v0] Error procesando mensaje:", error);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

export const mqttClient = new MQTTClient();