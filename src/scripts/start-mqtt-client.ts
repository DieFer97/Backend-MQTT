import { mqttClient } from "../lib/mqtt-client"

console.log("Iniciando cliente MQTT...")
mqttClient.connect()

process.on("SIGINT", () => {
  console.log("\nCerrando cliente MQTT...")
  mqttClient.disconnect()
  process.exit(0)
})
