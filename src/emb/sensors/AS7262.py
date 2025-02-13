import smbus2
import time


AS7262_ADDR = 0x49  
bus = smbus2.SMBus(1)

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

if __name__ == "__main__":
    while True:
        spectral_data = read_as7262()
        if spectral_data:
            print("AS7262 Spectral Data:", spectral_data)
        time.sleep(2)