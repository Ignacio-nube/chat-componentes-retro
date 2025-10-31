# 💬 Chat en Tiempo Real - Documentación

## 🚀 Características

Tu aplicación ahora incluye un **chat global en tiempo real** donde todas las cuentas pueden comunicarse entre sí usando **Socket.IO**.

### ✨ Funcionalidades Implementadas

- ✅ **Chat global** - Todos los usuarios conectados pueden verse y hablar entre sí
- ✅ **Mensajes en tiempo real** - Los mensajes aparecen instantáneamente para todos
- ✅ **Lista de usuarios en línea** - Ver quién está conectado en este momento
- ✅ **Indicador de escritura** - Ver cuando alguien está escribiendo
- ✅ **Mensajes del sistema** - Notificaciones cuando usuarios se conectan/desconectan
- ✅ **Auto-scroll** - El chat baja automáticamente al recibir nuevos mensajes
- ✅ **Diseño Neo-Brutalist** - Consistente con el resto de la aplicación
- ✅ **Responsive** - Funciona perfecto en móvil, tablet y escritorio

---

## 📋 Cómo Usar el Chat

### 1. Acceder al Chat

1. Inicia sesión en tu cuenta
2. En el Dashboard, haz clic en **"Chat"** en la navegación superior
3. El chat se conectará automáticamente

### 2. Ver Usuarios Conectados

En el **sidebar izquierdo** verás:
- Lista de todos los usuarios actualmente en línea
- Tu nombre con un badge "Tú"
- Avatares de cada usuario

### 3. Enviar Mensajes

1. Escribe tu mensaje en el input inferior
2. Presiona **Enter** o haz clic en **"Enviar"**
3. Tu mensaje aparecerá en amarillo (los mensajes de otros en blanco)

### 4. Ver Estado de Conexión

En la parte superior verás:
- 🟢 **Badge verde** = Conectado (con número de usuarios en línea)
- 🔴 **Badge rojo** = Desconectado

---

## 🛠️ Instalación (Ya Completada)

Las siguientes dependencias ya fueron instaladas:

**Backend:**
```bash
npm install socket.io
```

**Frontend:**
```bash
npm install socket.io-client
```

---

## 📂 Archivos Modificados

### Backend

**`backend/src/index.ts`**
- Integración de Socket.IO con Express
- Eventos del servidor:
  - `connection` - Nueva conexión
  - `usuario_conectado` - Usuario se une al chat
  - `enviar_mensaje` - Recibir mensaje
  - `escribiendo` - Usuario está escribiendo
  - `dejar_escribir` - Usuario dejó de escribir
  - `disconnect` - Usuario se desconecta

### Frontend

**`frontend/src/pages/Dashboard.tsx`**
- Componente `ContenidoChat` completamente rediseñado
- Integración de Socket.IO client
- Manejo de estado para mensajes, usuarios conectados, etc.
- Indicador de escritura en tiempo real

**`frontend/src/pages/Dashboard.css`**
- Estilos para el chat (`.chat-*`)
- Layout de dos columnas (sidebar + chat principal)
- Estilos para mensajes propios y ajenos
- Responsive design para móviles

---

## 🎨 Características del Diseño

### Mensajes

- **Mensajes propios**: Fondo amarillo (#FFDD00), alineados a la derecha
- **Mensajes de otros**: Fondo blanco, alineados a la izquierda
- **Mensajes del sistema**: Centrados, en gris (conexiones/desconexiones)
- **Bordes y sombras**: Estilo Neo-Brutalist consistente

### Layout

```
┌─────────────────────────────────────────┐
│  💬 Chat Global  [🟢 Conectado • 3]    │
├──────────┬──────────────────────────────┤
│ Usuarios │  Área de Mensajes            │
│ en línea │                               │
│          │  [Avatar] Usuario: Mensaje   │
│ • User1  │  [Avatar] User2: Respuesta   │
│ • User2  │                               │
│ • Tú     │  [Usuario escribiendo...]    │
│          │                               │
│          ├──────────────────────────────┤
│          │ [Input] [Enviar]             │
└──────────┴──────────────────────────────┘
```

---

## 🔧 Cómo Funciona (Técnico)

### Conexión al Chat

```typescript
// 1. Cuando el componente se monta
useEffect(() => {
  socketRef.current = io('http://localhost:3000');
  
  // 2. Al conectarse, envía el nombre de usuario
  socketRef.current.on('connect', () => {
    socketRef.current?.emit('usuario_conectado', usuario?.usuario);
  });
  
  // 3. Escucha eventos del servidor
  socketRef.current.on('recibir_mensaje', (mensaje) => {
    setMensajes(prev => [...prev, mensaje]);
  });
}, [usuario]);
```

### Envío de Mensajes

```typescript
const enviarMensaje = (e: React.FormEvent) => {
  e.preventDefault();
  if (mensaje.trim() && socketRef.current) {
    socketRef.current.emit('enviar_mensaje', {
      usuario: usuario?.usuario,
      mensaje: mensaje.trim()
    });
    setMensaje('');
  }
};
```

### Indicador de Escritura

```typescript
const manejarEscribir = (e: React.ChangeEvent<HTMLInputElement>) => {
  setMensaje(e.target.value);
  
  // Emite "escribiendo" mientras el usuario escribe
  if (e.target.value.length > 0) {
    socketRef.current.emit('escribiendo', usuario?.usuario);
    
    // Deja de mostrar después de 2 segundos de inactividad
    clearTimeout(escribiendoTimeoutRef.current);
    escribiendoTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('dejar_escribir');
    }, 2000);
  }
};
```

---

## 📡 Eventos de Socket.IO

### Del Cliente al Servidor

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `usuario_conectado` | `string` (nombre de usuario) | Notifica que un usuario se conectó |
| `enviar_mensaje` | `{usuario: string, mensaje: string}` | Envía un mensaje |
| `escribiendo` | `string` (nombre de usuario) | Usuario está escribiendo |
| `dejar_escribir` | - | Usuario dejó de escribir |

### Del Servidor al Cliente

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `usuario_unido` | `{usuario: string, usuariosConectados: array}` | Un usuario se unió |
| `usuario_desconectado` | `{usuario: string, usuariosConectados: array}` | Un usuario se desconectó |
| `recibir_mensaje` | `{id, usuario, mensaje, timestamp}` | Nuevo mensaje recibido |
| `usuario_escribiendo` | `string` (nombre de usuario) | Alguien está escribiendo |
| `usuario_dejo_escribir` | - | Dejaron de escribir |

---

## 🎯 Próximas Mejoras Sugeridas

### Corto Plazo
1. **Persistencia de mensajes** - Guardar mensajes en MySQL
2. **Historial del chat** - Cargar mensajes anteriores al conectarse
3. **Emojis** - Agregar selector de emojis
4. **Notificaciones** - Sonido cuando llega un mensaje nuevo

### Mediano Plazo
1. **Chats privados** - Mensajes directos entre usuarios
2. **Salas de chat** - Múltiples canales/temas
3. **Compartir archivos** - Enviar imágenes y documentos
4. **Formato de texto** - Markdown, negrita, cursiva

### Largo Plazo
1. **Videollamadas** - Integración con WebRTC
2. **Bots** - Comandos automáticos
3. **Moderación** - Bloquear usuarios, eliminar mensajes
4. **Encriptación** - Mensajes cifrados de extremo a extremo

---

## 🐛 Solución de Problemas

### El chat no conecta

**Problema**: Badge rojo "Desconectado"

**Solución**:
1. Verifica que el backend esté corriendo (`npm run dev` en `/backend`)
2. Verifica que Socket.IO esté en el puerto 3000
3. Revisa la consola del navegador por errores de CORS

### Los mensajes no se envían

**Problema**: Click en "Enviar" no hace nada

**Solución**:
1. Verifica que estés conectado (badge verde)
2. Asegúrate de escribir algo en el input
3. Revisa la consola del navegador por errores

### No veo usuarios conectados

**Problema**: Sidebar vacío

**Solución**:
1. Abre la aplicación en otra ventana/navegador
2. Inicia sesión con otra cuenta
3. Ambos usuarios deberían verse mutuamente

### Errores en consola

**Problema**: Errores de extensiones de Chrome

**Solución**:
- Estos NO son errores de tu código
- Son de extensiones del navegador (gestores de contraseñas, etc.)
- Puedes ignorarlos o usar modo incógnito

---

## 📊 Ejemplo de Uso Completo

### Escenario: 3 Usuarios Chateando

```
Usuario1 se conecta:
  → Sistema: "Usuario1 se unió al chat"
  → Lista: Usuario1

Usuario2 se conecta:
  → Sistema: "Usuario2 se unió al chat"
  → Lista: Usuario1, Usuario2

Usuario1 escribe "Hola!":
  → Todos ven: [Usuario1] Hola! [14:30]

Usuario2 comienza a escribir:
  → Usuario1 ve: "Usuario2 está escribiendo..."

Usuario2 envía "Hola! ¿Cómo están?":
  → Todos ven: [Usuario2] Hola! ¿Cómo están? [14:31]

Usuario3 se conecta:
  → Sistema: "Usuario3 se unió al chat"
  → Lista: Usuario1, Usuario2, Usuario3

Usuario1 se desconecta:
  → Sistema: "Usuario1 se desconectó"
  → Lista: Usuario2, Usuario3
```

---

## 🔒 Seguridad

### Implementado
- ✅ CORS configurado
- ✅ Validación de mensajes (no vacíos)
- ✅ Conexiones autenticadas (usuario conocido)

### Por Implementar
- ⚠️ Rate limiting (prevenir spam)
- ⚠️ Sanitización de mensajes (prevenir XSS)
- ⚠️ Validación de longitud de mensajes
- ⚠️ Lista negra de palabras

---

## 🎓 Lo Que Aprendiste

Al implementar este chat, has trabajado con:

1. **Socket.IO** - WebSockets en tiempo real
2. **useRef** - Referencias a sockets y elementos DOM
3. **useEffect** - Manejo de conexiones y limpieza
4. **Auto-scroll** - ScrollIntoView API
5. **Timeouts** - Debouncing para el indicador de escritura
6. **Maps** - Estructura de datos para usuarios conectados
7. **Broadcasting** - Envío de eventos a múltiples clientes

---

## 📞 Recursos

### Documentación Oficial
- **Socket.IO**: https://socket.io/docs/v4/
- **React Hooks**: https://react.dev/reference/react

### Tutoriales Recomendados
- Socket.IO + React: https://socket.io/how-to/use-with-react
- Real-time Apps: https://socket.io/get-started/chat

---

## 🎉 ¡Listo!

Tu chat en tiempo real está funcionando. Prueba:

1. Abre 2-3 ventanas del navegador
2. Inicia sesión con diferentes usuarios
3. Empieza a chatear
4. Observa cómo los mensajes aparecen instantáneamente

**¡Diviértete chateando! 💬🚀**

---

*Creado con ❤️ usando Socket.IO, React y mucho café ☕*
