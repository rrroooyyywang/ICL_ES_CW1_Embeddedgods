import smbus2
import time


SI7021_ADDR = 0x40
bus = smbus2.SMBus(1)

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

if __name__ == "__main__":
    while True:
        temp, humidity = read_si7021()
        if temp is not None:
            print(f"Si7021 - Temperature: {temp}°C, Humidity: {humidity}%")
        time.sleep(2)
