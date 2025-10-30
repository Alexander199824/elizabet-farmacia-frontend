# Guía de Deployment en Vercel

## Configuración del Proyecto

Este proyecto está configurado para ser desplegado en **Vercel** con el backend alojado en **Render**.

### Archivos de Configuración

- **vercel.json**: Configuración de Vercel para SPA routing
- **.env.production**: Variables de entorno para producción
- **.vercelignore**: Archivos que Vercel debe ignorar

---

## Pasos para Desplegar en Vercel

### 1. Preparar el Repositorio

```bash
# Asegúrate de que todos los cambios estén commiteados
git add .
git commit -m "Configuración para deployment en Vercel"
git push origin master
```

### 2. Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Regístrate o inicia sesión (preferiblemente con tu cuenta de GitHub)

### 3. Importar el Proyecto

#### Opción A: Desde la interfaz web de Vercel

1. Click en **"Add New Project"**
2. Importa tu repositorio de GitHub
3. Selecciona el repositorio `elizabet-farmacia-frontend`

#### Opción B: Usando Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel
```

### 4. Configurar el Proyecto en Vercel

Durante la importación, configura lo siguiente:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```env
VITE_API_URL=https://farmacia-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=827516973269-072ud34r9shevkmn925rr4j8224r92nk.apps.googleusercontent.com
VITE_FARMACIA_NAME=Farmacia Elizabeth
VITE_FARMACIA_PHONE=+502 79388605
VITE_FARMACIA_EMAIL=info@farmaciaelizabeth.com
VITE_FARMACIA_ADDRESS=Rabinal Baja Verapaz
```

**IMPORTANTE**: Asegúrate de agregar estas variables para los tres ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Desplegar

Click en **"Deploy"** y espera a que Vercel construya y despliegue tu aplicación.

---

## Configuración Post-Deployment

### A. Actualizar Google Cloud Console

Una vez que tu app esté desplegada, obtendrás una URL como:
```
https://tu-app.vercel.app
```

Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials) y actualiza:

**Orígenes de JavaScript autorizados:**
- `https://tu-app.vercel.app`
- `http://localhost:5173` (para desarrollo local)

**URI de redireccionamiento autorizados:**
- `https://farmacia-backend.onrender.com/api/users/auth/google/callback`
- `http://localhost:5000/api/users/auth/google/callback` (para desarrollo local)

### B. Actualizar Backend (CORS)

En tu backend en Render, asegúrate de que CORS esté configurado para aceptar peticiones desde:
- `https://tu-app.vercel.app`
- `http://localhost:5173`

Ejemplo en Express:
```javascript
app.use(cors({
  origin: [
    'https://tu-app.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

---

## Dominios Personalizados

### Configurar un Dominio Custom

1. Ve a **Settings > Domains** en tu proyecto de Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel
4. Actualiza Google OAuth y CORS con el nuevo dominio

---

## Comandos Útiles

```bash
# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Ver el proyecto en el navegador
vercel open

# Eliminar el proyecto
vercel remove
```

---

## Troubleshooting

### Error: "Cannot connect to backend"

- Verifica que `VITE_API_URL` esté correctamente configurada en Vercel
- Verifica que el backend en Render esté activo
- Revisa la configuración de CORS en el backend

### Error: Google OAuth "Origin not allowed"

- Verifica que la URL de Vercel esté agregada en Google Cloud Console
- Asegúrate de incluir tanto `https://` como el dominio exacto
- Los cambios en Google Cloud pueden tardar unos minutos

### Error de Build

- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel
- Asegúrate de que `npm run build` funcione localmente

### Variables de entorno no funcionan

- Las variables DEBEN empezar con `VITE_` para estar disponibles en el cliente
- Recarga el deployment después de agregar nuevas variables
- Verifica que estén configuradas para el ambiente correcto (Production/Preview)

---

## Notas Importantes

1. **No subir archivos .env a Git**: Los archivos `.env` y `.env.production` están en `.gitignore` por seguridad
2. **Variables de entorno en Vercel**: Todas las variables deben configurarse en el dashboard de Vercel
3. **Rebuild después de cambios**: Si cambias variables de entorno, necesitas hacer un nuevo deploy
4. **HTTPS automático**: Vercel proporciona HTTPS automáticamente para todos los dominios

---

## Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Google OAuth Configuration](https://console.cloud.google.com/apis/credentials)

---

**Autor**: Alexander Echeverria
**Proyecto**: Farmacia Elizabeth Frontend
**Última actualización**: Octubre 2025
