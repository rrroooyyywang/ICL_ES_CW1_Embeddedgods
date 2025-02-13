import smbus2 as smbus
import paho.mqtt.client as mqtt
import INA219
import time
import json
import ssl

MQTT_BROKER = "xx.xx.euc1.aws.hivemq.cloud"
MQTT_PORT = 8883  
MQTT_TOPIC = "battery"
MQTT_USERNAME = "your-username"
MQTT_PASSWORD = "your-password"

ina219 = INA219.INA219(addr=0x43)

client = mqtt.Client()

def connect_mqtt():
    try:
        client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)  
        client.tls_set_context(ssl.create_default_context())  
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        print("Connected to MQTT broker")
    except Exception as e:
        print(f"MQTT connection failed: {e}")

def publish_battery_data():
    while True:
        try:
            bus_voltage = ina219.getBusVoltage_V()             
            shunt_voltage = ina219.getShuntVoltage_mV() / 1000 
            current = ina219.getCurrent_mA() / 1000            
            power = ina219.getPower_W()                       
            
            battery_percentage = (bus_voltage - 3) / 1.2 * 100
            battery_percentage = max(0, min(100, battery_percentage))  

            battery_data = {
                "voltage": round(bus_voltage, 3),
                "current": round(current, 3),
                "power": round(power, 3),
                "battery_percentage": round(battery_percentage, 1)
            }


            client.publish(MQTT_TOPIC, json.dumps(battery_data))
            print(f"Published: {battery_data}")

        except Exception as e:
            print(f"Error reading INA219: {e}")

        time.sleep(10) 


if __name__ == "__main__":
    connect_mqtt()
    client.loop_start()
    publish_battery_data()
