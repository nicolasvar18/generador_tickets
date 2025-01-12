# 🎫 Sistema de Gestión de Tickets

<div align="center">
  <img src="src/img/logo.png" alt="Logo" width="200"/>
</div>

## 📋 Descripción

Aplicación web desarrollada en React para la gestión de tickets de soporte. Permite a los usuarios generar solicitudes y a los administradores gestionarlas eficientemente con seguimiento en tiempo real.

## ✨ Características Principales

- 🔐 Sistema de autenticación para administradores
- 📧 Notificaciones por correo automáticas
- 📁 Carga de archivos adjuntos
- 🔍 Filtrado y búsqueda de tickets
- 📊 Panel de administración
- 📱 Diseño responsive
- 💾 Almacenamiento en la nube

## 🛠️ Tecnologías Utilizadas

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
- ![EmailJS](https://img.shields.io/badge/EmailJS-CF4647?style=for-the-badge)
- ![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/nombre-repo.git
cd nombre-repo
```

2. Instala las dependencias:
```bash
yarn install
```

3. Configura las variables de entorno:
```env
REACT_APP_EMAILJS_SERVICE_ID=tu_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=tu_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=tu_public_key
```

4. Inicia la aplicación:
```bash
yarn start
```

## ⚙️ Configuración

### Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore y Storage
3. Configura las reglas de seguridad
4. Copia las credenciales en `src/firebase/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-auth-domain",
  projectId: "tu-project-id",
  storageBucket: "tu-storage-bucket",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

### EmailJS

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura los servicios de correo:
   - Template para usuarios: Confirmación de ticket
   - Template para administradores: Notificación de nuevo ticket
3. Obtén las credenciales necesarias:
   - Service ID
   - Template ID
   - Public Key

## 👥 Roles y Funcionalidades

### Usuario Regular
- Crear tickets de soporte
- Adjuntar archivos (máx. 20MB)
- Recibir confirmación por correo
- Seguimiento del estado del ticket

### Administrador
- Acceso al panel de administración
- Gestionar estados de tickets
- Asignar responsables
- Filtrar y buscar tickets
- Exportar datos a Excel

## 🔐 Acceso Administrativo

Para acceder al panel de administración:
1. Clic en botón "Admin"
2. Ingresar contraseña: `admin123`

### 📧 Correo de Administración
Para ver los correos de notificación de tickets:
1. Ir a [YOPmail](https://yopmail.com)
2. Ingresar: `admintickets@yopmail.com`
3. Los correos de nuevos tickets aparecerán en la bandeja de entrada

> ⚠️ Nota: YOPmail es un servicio de correo temporal usado para demostración. En producción, configura un correo real.

## 📧 Plantillas de Correo

### Template Usuario
```html
Hola {{to_name}},

Tu ticket #{{ticketId}} ha sido registrado exitosamente.
Requerimiento: {{message}}

Seguiremos en contacto.
```

### Template Administrador
```html
Nuevo ticket registrado:
ID: {{ticketId}}
Usuario: {{to_name}}
Mensaje: {{message}}
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 💻 Escritorio
- 📱 Tablets
- 📱 Móviles

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Haz Fork del proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Soporte

Para soporte o preguntas, por favor abre un issue en el repositorio.

---
<div align="center">
  Desarrollado con ❤️ por <a href="https://nicolasvargas.dev" target="_blank">nicolasvargas.dev</a>
</div>
