import time
import smbus2
from bmp280 import BMP280


BMP280_ADDR = 0x76 


bus = smbus2.SMBus(1)

bmp280 = BMP280(i2c_dev=bus, i2c_addr=BMP280_ADDR)

bmp280.mode = BMP280.NORMAL_MODE

def read_bmp280():

    try:
        temperature = bmp280.get_temperature()
        pressure = bmp280.get_pressure()

        print(f"Temperature: {temperature:.2f} °C")
        print(f"Pressure: {pressure:.2f} hPa")

        return temperature, pressure

    except Exception as e:
        print(f"BMP280 Read Error: {e}")
        return None, None

if __name__ == "__main__":
    while True:
        read_bmp280()
        time.sleep(2)  
