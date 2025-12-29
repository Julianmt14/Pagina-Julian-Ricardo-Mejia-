# 🚀 INSTRUCCIONES DE USO - Portafolio Julian Mejía

## ⚡ Inicio Rápido (Quick Start)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm start

# 3. Abrir en el navegador
# Portafolio: http://localhost:3000
# Admin: http://localhost:3000/admin/messages
```

---

## 📝 Instrucciones Paso a Paso

### Paso 1: Verificar Node.js

Asegúrate de tener Node.js instalado:

```bash
node --version
# Debe mostrar: v16.0.0 o superior
```

Si no lo tienes, descárgalo de: https://nodejs.org/

---

### Paso 2: Abrir Terminal en la Carpeta del Proyecto

#### Windows:
1. Abre el explorador de archivos
2. Navega a la carpeta `Pagina-Julian-Ricardo-Mejia-`
3. En la barra de direcciones, escribe `cmd` y presiona Enter
4. Se abrirá la terminal en esa ubicación

#### Mac/Linux:
1. Abre Terminal
2. Usa `cd` para navegar a la carpeta:
   ```bash
   cd /ruta/a/Pagina-Julian-Ricardo-Mejia-
   ```

---

### Paso 3: Instalar Dependencias

En la terminal, ejecuta:

```bash
npm install
```

Verás algo como:
```
added 57 packages, and audited 58 packages in 5s
```

**¿Qué hace esto?**
- Instala Express, SQLite3, y otras librerías necesarias
- Crea la carpeta `node_modules` (ignorada por Git)
- Solo necesitas hacerlo una vez

---

### Paso 4: Iniciar el Servidor

```bash
npm start
```

Verás:
```
╔════════════════════════════════════════════════════════════╗
║          🚀 Servidor del Portafolio Iniciado              ║
╠════════════════════════════════════════════════════════════╣
║  📱 Portafolio: http://localhost:3000                     ║
║  📬 Ver mensajes: http://localhost:3000/admin/messages    ║
║  📊 API Status: http://localhost:3000/api/health          ║
╠════════════════════════════════════════════════════════════╣
║  💡 Los mensajes se mostrarán aquí cuando lleguen        ║
╚════════════════════════════════════════════════════════════╝
```

**¡Perfecto! El servidor está corriendo.**

---

### Paso 5: Abrir el Portafolio

Abre tu navegador (Chrome, Firefox, Edge, Safari) y ve a:

```
http://localhost:3000
```

Deberías ver tu portafolio con:
- ✅ Tema oscuro
- ✅ Botón verde de WhatsApp flotante (esquina inferior derecha)
- ✅ Todo funcionando

---

### Paso 6: Ver la Interfaz de Admin

En otra pestaña del navegador, abre:

```
http://localhost:3000/admin/messages
```

Verás la página de administración donde aparecerán todos los mensajes.

---

### Paso 7: Probar el Formulario

1. En el portafolio, navega hasta la sección "Contacto"
2. Llena el formulario con datos de prueba:
   - Nombre: Juan Pérez
   - Email: juan@test.com
   - Asunto: Prueba
   - Mensaje: Hola, esto es una prueba

3. Haz clic en "Enviar Mensaje"

4. Verás una notificación verde: "¡Mensaje enviado con éxito!"

5. En la terminal verás:
   ```
   === NUEVO MENSAJE RECIBIDO ===
   📧 De: Juan Pérez
   ✉️  Email: juan@test.com
   📝 Asunto: Prueba
   💬 Mensaje: Hola, esto es una prueba
   🕐 Fecha: 29/12/2024 16:30:00
   ============================
   ```

6. Refresca la página de admin para ver el mensaje guardado

---

## 🎯 ¿Qué Puedes Hacer Ahora?

### Ver Todos los Mensajes
```
http://localhost:3000/admin/messages
```
- Página bonita con tema oscuro
- Lista completa de mensajes
- Botón de actualizar

### Verificar que el Servidor Funciona
```
http://localhost:3000/api/health
```
Respuesta:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-12-29T21:30:00.000Z"
}
```

### Ver Mensajes en Formato JSON
```
http://localhost:3000/api/messages
```
Útil para integraciones o debugging

---

## 🔧 Comandos Útiles

### Iniciar el Servidor (Normal)
```bash
npm start
```

### Iniciar el Servidor (Modo Desarrollo - Auto-reload)
```bash
npm run dev
```
**Nota**: Requiere tener nodemon instalado

### Detener el Servidor
Presiona `Ctrl + C` en la terminal

### Ver Versión de Node
```bash
node --version
```

### Ver Versión de npm
```bash
npm --version
```

---

## 📱 Acceder desde tu Celular

Si quieres ver el portafolio desde tu celular en la misma red WiFi:

### Paso 1: Obtener tu IP Local

**Windows:**
```bash
ipconfig
```
Busca "Dirección IPv4" (ejemplo: 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Busca "inet" (ejemplo: 192.168.1.100)

### Paso 2: Acceder desde el Celular

En el navegador del celular:
```
http://TU-IP:3000
```
Ejemplo: `http://192.168.1.100:3000`

---

## ❓ Problemas Comunes y Soluciones

### Error: "Cannot find module 'express'"
**Solución:** Ejecuta `npm install`

### Error: "Port 3000 is already in use"
**Solución:** 
1. Cierra cualquier otra aplicación usando el puerto 3000
2. O cambia el puerto en `.env` (crea el archivo si no existe):
   ```
   PORT=3001
   ```

### Error: "npm: command not found"
**Solución:** Instala Node.js desde https://nodejs.org/

### No veo mensajes en /admin/messages
**Solución:** 
1. Verifica que el servidor esté corriendo
2. Envía un mensaje de prueba desde el formulario
3. Refresca la página con F5

### El tema oscuro no se ve
**Solución:**
1. Refresca la página con Ctrl + F5 (recarga completa)
2. Limpia la caché del navegador

---

## 🌐 Desplegar en Producción

Para subir tu portafolio a internet:

### Opción 1: GitHub Pages (Solo Frontend)
El tema oscuro y diseño funcionarán, pero no el formulario backend.

### Opción 2: Heroku/Railway/Render (Frontend + Backend)
Sube todo el proyecto para tener el formulario funcionando.

**Pasos generales:**
1. Sube tu código a GitHub
2. Conecta con el servicio de hosting
3. Configura variables de entorno (.env)
4. Despliega
5. Accede a tu URL personalizada

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa la documentación:**
   - `README.md` - Documentación técnica
   - `GUIA-MENSAJES.md` - Guía de mensajes
   - `RESUMEN-IMPLEMENTACION.md` - Resumen completo

2. **Contacta al desarrollador:**
   - 📧 Email: julianricardomt@gmail.com
   - 📱 WhatsApp: +57 311 584 6717
   - 💻 GitHub: @Julianmt14

---

## ✅ Checklist de Verificación

Marca cada elemento cuando funcione:

- [ ] Node.js instalado (`node --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)
- [ ] Portafolio abre en http://localhost:3000
- [ ] Tema oscuro se ve correctamente
- [ ] Botón de WhatsApp visible y funcional
- [ ] Formulario envía mensajes
- [ ] Mensajes aparecen en consola
- [ ] Admin panel funciona en /admin/messages
- [ ] Base de datos guarda mensajes

---

## 🎉 ¡Listo!

Tu portafolio está completamente funcional con:
- ✅ Diseño oscuro profesional
- ✅ Backend con base de datos
- ✅ Formulario de contacto funcional
- ✅ Botón de WhatsApp
- ✅ Panel de administración

**¡Disfruta tu nuevo portafolio mejorado! 🚀**

---

*Última actualización: 29 de Diciembre, 2024*
