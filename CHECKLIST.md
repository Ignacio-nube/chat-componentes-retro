# ✅ Checklist de Verificación - Sistema de Login

Usa esta lista para verificar que todo está funcionando correctamente.

## 🔧 Configuración Inicial

### Backend
- [ ] MySQL está instalado y corriendo
- [ ] Base de datos creada
- [ ] Script `bd.sql` ejecutado correctamente
- [ ] Archivo `.env` creado con las variables:
  - [ ] `PUERTO=3000`
  - [ ] `DB_HOST=localhost`
  - [ ] `DB_USER=tu_usuario`
  - [ ] `DB_PASSWORD=tu_contraseña`
  - [ ] `DB_NAME=nombre_base_datos`
  - [ ] `JWT_SECRET=secreto_seguro`
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor backend corriendo (`npm run dev`)
- [ ] Backend responde en `http://localhost:3000`

### Frontend
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor frontend corriendo (`npm run dev`)
- [ ] Frontend accesible en `http://localhost:5173` o `5174`
- [ ] Sin errores en la consola del navegador
- [ ] Sin errores de TypeScript

---

## 🧪 Pruebas Funcionales

### Registro
- [ ] La página de login se muestra correctamente
- [ ] Botón "Registrarse" cambia a formulario de registro
- [ ] Formulario muestra todos los campos:
  - [ ] Usuario
  - [ ] Correo
  - [ ] Contraseña
  - [ ] Confirmar contraseña
- [ ] Validaciones funcionan:
  - [ ] Error si campos vacíos
  - [ ] Error si contraseñas no coinciden
  - [ ] Error si contraseña muy corta
  - [ ] Error si email inválido
- [ ] Registro exitoso:
  - [ ] Usuario se crea en la base de datos
  - [ ] Token se recibe
  - [ ] Redirección al dashboard
  - [ ] Sesión persiste al recargar página

### Login
- [ ] Formulario de login se muestra correctamente
- [ ] Campos presentes:
  - [ ] Usuario
  - [ ] Contraseña
- [ ] Validaciones funcionan:
  - [ ] Error si campos vacíos
  - [ ] Error si credenciales incorrectas
- [ ] Login exitoso:
  - [ ] Token se recibe
  - [ ] Redirección al dashboard
  - [ ] Datos del usuario se cargan
  - [ ] Sesión persiste al recargar

### Dashboard
- [ ] Dashboard se muestra tras login/registro
- [ ] Header visible con:
  - [ ] Logo de la app
  - [ ] Badge de versión
  - [ ] Barra de navegación (desktop)
  - [ ] Avatar del usuario
  - [ ] Nombre del usuario
  - [ ] Badge "En línea"
  - [ ] Botón "Salir"
- [ ] Navegación funciona:
  - [ ] Click en links cambia sección (desktop)
  - [ ] Tabs funcionan (móvil)
  - [ ] Contenido cambia correctamente
- [ ] Secciones visibles:
  - [ ] 🏠 Inicio
  - [ ] 📊 Proyectos
  - [ ] ⚙️ Configuración
  - [ ] 📚 Componentes

#### Sección Inicio
- [ ] Mensaje de bienvenida con nombre de usuario
- [ ] Alert de "cuenta verificada"
- [ ] Cards con información:
  - [ ] Card con correo
  - [ ] Card con ID de usuario
  - [ ] Card con estado y badge
- [ ] Card de "Comienza a explorar"
- [ ] Botones de acción visibles

#### Sección Proyectos
- [ ] Título "Mis Proyectos" visible
- [ ] Botón "+ Nuevo Proyecto"
- [ ] Alert informativa
- [ ] 3 cards de proyectos de ejemplo
- [ ] Cada card tiene badges

#### Sección Configuración
- [ ] Título "Configuración" visible
- [ ] Card con información de cuenta:
  - [ ] Usuario
  - [ ] Correo
  - [ ] ID
- [ ] Botones de acción:
  - [ ] "Editar Perfil"
  - [ ] "Cambiar Contraseña"
- [ ] Card de preferencias

#### Sección Componentes
- [ ] Título "Biblioteca de Componentes"
- [ ] Alert informativa
- [ ] Showcase de botones (5 variantes)
- [ ] Showcase de badges (5 variantes)
- [ ] Showcase de alertas (4 tipos)

### Logout
- [ ] Click en "Salir" cierra sesión
- [ ] Redirección a página de login
- [ ] Token eliminado de localStorage
- [ ] Usuario eliminado de localStorage
- [ ] No se puede acceder al dashboard sin login

### Protección de Rutas
- [ ] Sin login, acceder a `/dashboard` redirige a `/login`
- [ ] Con login, acceder a `/login` permite quedarse
- [ ] Ruta `/` redirige a `/dashboard`
- [ ] Rutas inexistentes redirigen a `/dashboard`

---

## 📱 Responsive Design

### Desktop (>1024px)
- [ ] Barra de navegación visible
- [ ] Tabs ocultas
- [ ] Layout de 3 columnas en grids
- [ ] Todo el contenido visible sin scroll horizontal

### Tablet (768px - 1024px)
- [ ] Barra de navegación oculta
- [ ] Tabs visibles y funcionales
- [ ] Layout de 2 columnas en grids
- [ ] Header se adapta correctamente

### Mobile (<768px)
- [ ] Tabs visibles y funcionales
- [ ] Layout de 1 columna en grids
- [ ] Header compacto
- [ ] Info de usuario oculta (solo avatar)
- [ ] Botones de ancho completo
- [ ] Sin scroll horizontal

### Small Mobile (<480px)
- [ ] Todo sigue funcional
- [ ] Textos legibles
- [ ] Botones tocables (min 44x44px)
- [ ] Formularios usables

---

## 🎨 Diseño Visual

### Colores
- [ ] Tema Neo-Brutalist aplicado
- [ ] Bordes negros de 3-4px
- [ ] Sombras negras (box-shadow)
- [ ] Colores correctos:
  - [ ] Yellow: #FFDD00
  - [ ] Black: #000000
  - [ ] White: #FFFFFF
  - [ ] Red: #FF0000
  - [ ] Green: #00FF00

### Tipografía
- [ ] Fuentes legibles
- [ ] Títulos en mayúsculas
- [ ] Fuente en negrita para títulos
- [ ] Tamaños de texto apropiados

### Animaciones
- [ ] Transiciones suaves (0.2s - 0.3s)
- [ ] Hover effects en botones
- [ ] Hover effects en cards (cuando aplica)
- [ ] Animación de fade-in al cambiar sección
- [ ] Decoraciones flotantes en login (desktop)

### Componentes
- [ ] Todos los botones tienen efecto hover
- [ ] Cards tienen bordes y sombras
- [ ] Inputs tienen estilo consistente
- [ ] Badges tienen colores correctos
- [ ] Alerts tienen íconos y colores correctos

---

## 🔒 Seguridad

### Frontend
- [ ] Contraseñas no se muestran (type="password")
- [ ] Token no se muestra en la UI
- [ ] Validación de inputs antes de enviar
- [ ] Mensajes de error no revelan info sensible

### Backend
- [ ] Contraseñas hasheadas en BD
- [ ] Token JWT con expiración
- [ ] Validación de inputs en servidor
- [ ] SQL preparado (no concatenación)
- [ ] CORS configurado correctamente
- [ ] Variables sensibles en .env

---

## 🐛 Errores Comunes

### ¿La app no carga?
- [ ] Backend está corriendo
- [ ] Frontend está corriendo
- [ ] Puertos correctos (3000 y 5173/5174)
- [ ] No hay errores en consola

### ¿No puedo registrarme?
- [ ] Base de datos está corriendo
- [ ] Tabla `usuarios` existe
- [ ] Conexión a BD configurada correctamente
- [ ] Revisa consola del backend por errores

### ¿No persiste la sesión?
- [ ] localStorage habilitado en navegador
- [ ] Token se guarda correctamente
- [ ] AuthContext carga token al iniciar

### ¿Estilos se ven mal?
- [ ] Archivos CSS importados correctamente
- [ ] neoBrutalist.css cargado
- [ ] Sin conflictos de CSS
- [ ] Cache del navegador limpia

---

## 📊 Rendimiento

- [ ] Página carga en menos de 2 segundos
- [ ] Navegación entre secciones es instantánea
- [ ] No hay lag al escribir en formularios
- [ ] Imágenes/assets optimizados
- [ ] Sin memory leaks en consola

---

## 📝 Documentación

- [ ] `GUIA_DE_USO.md` leída
- [ ] `EJEMPLOS_DE_CODIGO.md` revisada
- [ ] `API_DOCUMENTACION.md` consultada
- [ ] `README_PROYECTO.md` leída

---

## 🚀 Listo para Desarrollo

- [ ] Todo el checklist completado ✅
- [ ] Sin errores críticos
- [ ] Flujo completo probado
- [ ] Listo para agregar funcionalidades

---

## 📈 Siguientes Pasos

Una vez completado este checklist:

1. [ ] Personalizar diseño con tu marca
2. [ ] Agregar tu primera funcionalidad
3. [ ] Crear tu primer endpoint personalizado
4. [ ] Subir a Git
5. [ ] Planificar features adicionales

---

## ✅ Estado General

Marca cuando esté listo:

- [ ] ✅ Configuración completa
- [ ] ✅ Todas las pruebas pasan
- [ ] ✅ Responsive funciona en todos los tamaños
- [ ] ✅ Diseño visual correcto
- [ ] ✅ Seguridad verificada
- [ ] ✅ Sin errores
- [ ] ✅ Rendimiento aceptable
- [ ] ✅ Documentación leída

---

**¡Cuando todos los checkboxes estén marcados, tu aplicación está lista! 🎉**

---

*Última actualización: Octubre 2025*
