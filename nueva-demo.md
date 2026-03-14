# Nueva Demo — Checklist

## 1. Investigar al negocio (llenar antes de abrir el editor)

```
Nombre oficial:
Teléfono/WhatsApp (con código país, ej. 5216621234567):
Email:
Dirección completa:
Ciudad:
Estado:
Código postal:
Coordenadas GPS (Google Maps → clic derecho → copiar):
Google Maps Place ID (maps.google.com → buscar negocio → URL contiene place/...):

Instagram URL:
Facebook URL:
TikTok URL (o dejar vacío):

Capacidad mínima:
Capacidad máxima:
Precio por persona (desde):
Precio por persona (hasta):
Precio mínimo total:
Horario máximo de eventos (ej. 2:00 AM):
Tipos de evento: bodas / xv / bautizos / empresariales / otro

Logo conseguido (jpg/png): SÍ / NO
Foto hero conseguida:      SÍ / NO
Color primario (hex):
Color acento (hex):

Dominio propuesto (ej. salonaurora.mx):
Tagline propuesto:
```

---

## 2. Crear el sitio en Firebase Console

1. Ir a https://console.firebase.google.com → proyecto `salon-primavera`
2. Hosting → **Agregar sitio**
3. Nombre del sitio (ej. `salon-aurora`) → Agregar sitio
4. Apuntar el nombre para el paso 4

---

## 3. Clonar y configurar

```bash
# Clonar en carpeta nueva (desde la carpeta padre de venue-template)
cp -r venue-template salon-aurora
cd salon-aurora
```

Editar **solo** estos archivos:

### `config/client.js`
Reemplazar todos los datos con la info del checklist de arriba.

### `firebase.json` — cambiar el target
```json
"target": "salon-aurora"
```

### `.firebaserc` — agregar el nuevo sitio
```json
{
  "projects": { "default": "salon-primavera" },
  "targets": {
    "salon-primavera": {
      "hosting": {
        "elmarques": ["salon-primavera"],
        "salon-aurora": ["salon-aurora"]
      }
    }
  }
}
```

### `assets/`
- Reemplazar `logo.jpg` y `logo.webp` con el logo del cliente
- Reemplazar `hero-fallback.jpg` y `hero-fallback.webp` con foto del salón
- Reemplazar `og-image.jpg` (puede ser la misma foto hero)

---

## 4. Revisar local y deployar

```bash
# Revisar en local
npx serve .
# Abrir http://localhost:3000

# Deploy
firebase deploy --only hosting
```

URL resultante: `https://salon-aurora.web.app`

---

## 5. Enviar el pitch

```
Hola, buenos días 👋

Mi nombre es José Ibarra de Ibani Digital. Vi que [Negocio] no cuenta
con página web, y un negocio con el nivel de servicio que ofrecen
definitivamente merece tener una. Por eso me tomé el tiempo de hacerles una:

🌐 https://salon-aurora.web.app

Incluye galería de fotos, información de paquetes, formulario de
cotización, calendario de disponibilidad y más.

Se la dejo gratis por 1 mes para que la pruebe. Si le interesa quedársela:
• Dominio propio (salonaurora.mx): $250 MXN pago único
• Mantenimiento mensual: $1,500 MXN/mes

Y si prefiere que la borre, con gusto lo hago. 😊

Quedo a sus órdenes.
```
