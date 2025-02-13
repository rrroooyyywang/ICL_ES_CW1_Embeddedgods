import time
import json
import smbus2
import paho.mqtt.client as mqtt
import UPS.INA219
import ssl
#MQTT Broker
MQTT_BROKER = "xx.xx.euc1.aws.hivemq.cloud"
MQTT_PORT = 8883  
MQTT_TOPIC = "battery"
MQTT_USERNAME = "your-username"
MQTT_PASSWORD = "your-password"


# I2C Addresses
INA219_ADDR = 0x43
AS7262_ADDR = 0x49  # AS7262
SI7021_ADDR = 0x40  # Si7021

#INIt
bus = smbus2.SMBus(1)
ina219 = INA219.INA219(addr=INA219_ADDR)

#read Si7021
def read_si7021():
    try:
        bus.write_byte(SI7021_ADDR, 0xF3)
        time.sleep(0.5)
        temp_raw = bus.read_word_data(SI7021_ADDR, 0xE0)
        temperature = ((temp_raw * 175.72) / 65536.0) - 46.85

        bus.write_byte(SI7021_ADDR, 0xF5)
        time.sleep(0.5)
        humidity_raw = bus.read_word_data(SI7021_ADDR, 0xE0)
        humidity = ((humidity_raw * 125.0) / 65536.0) - 6.0

        return round(temperature, 2), round(humidity, 2)

    except Exception as e:
        print(f"Si7021 Read Error: {e}")
        return None, None

#read AS7262
def read_as7262():
    try:
        data = {}
        channels = ["Violet", "Blue", "Green", "Yellow", "Orange", "Red"]
        for i, channel in enumerate(channels):
            reg = 0x08 + (i * 2)  
            value = bus.read_word_data(AS7262_ADDR, reg)
            data[channel] = value
        return data

    except Exception as e:
        print(f"AS7262 Read Error: {e}")
        return None

# read battery
def read_battery():
    try:
        bus_voltage = ina219.getBusVoltage_V()  
        # shunt_voltage = ina219.getShuntVoltage_mV() / 1000  
        current = ina219.getCurrent_mA() / 1000  
        power = ina219.getPower_W()

        battery_percentage = (bus_voltage - 3) / 1.2 * 100
        battery_percentage = max(0, min(100, battery_percentage))

        return {
            "voltage": round(bus_voltage, 3),
            "current": round(current, 3),
            "power": round(power, 3),
            "battery_percentage": round(battery_percentage, 1),
        }

    except Exception as e:
        print(f"INA219 Read Error: {e}")
        return None

# connect MQTT broker
def connect_mqtt():
    client = mqtt.Client()
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set_context(ssl.create_default_context())  
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        print("Connected to MQTT broker")
        return client
    except Exception as e:
        print(f"MQTT connection failed: {e}")
        return None

# publish data
def publish_data(client):
    while True:
        try:
            battery_data = read_battery()
            si7021_temp, si7021_humidity = read_si7021()
            as7262_data = read_as7262()

            if battery_data and si7021_temp is not None and as7262_data:
                payload = {
                    "battery": battery_data,
                    "si7021": {
                        "temperature": si7021_temp,
                        "humidity": si7021_humidity,
                    },
                    "as7262": as7262_data
                }

                message = json.dumps(payload)
                client.publish(MQTT_TOPIC, message)
                print(f"Published: {message}")

            else:
                print("Error: One or more sensors failed to provide data.")

        except Exception as e:
            print(f"Error in publishing: {e}")

        time.sleep(10)

# Main function
if __name__ == "__main__":
    mqtt_client = connect_mqtt()
    if mqtt_client:
        mqtt_client.loop_start() 
        publish_data(mqtt_client)
