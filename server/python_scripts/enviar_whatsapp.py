from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

contacto = "Miltonr13"
import os
archivo_mensaje = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'storage', 'app', 'mensaje_wsp.txt'))


# Leer mensaje generado por Laravel
with open(archivo_mensaje, "r", encoding="utf-8") as f:
    mensaje = f.read()

driver = webdriver.Chrome()
driver.get("https://web.whatsapp.com")
print("Escaneá el código QR si no lo hiciste ya...")
time.sleep(30)  # Tiempo para escanear QR

# Buscar contacto
busqueda = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="3"]')
busqueda.send_keys(contacto)
time.sleep(2)

# Hacer clic en el contacto
chat = driver.find_element(By.XPATH, f'//span[@title="{contacto}"]')
chat.click()
time.sleep(1)

# Enviar el mensaje
cuadro = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
for linea in mensaje.split("\n"):
    cuadro.send_keys(linea)
    cuadro.send_keys(Keys.SHIFT + Keys.ENTER)
cuadro.send_keys(Keys.ENTER)

print("Mensaje enviado.")
time.sleep(5)
driver.quit()
