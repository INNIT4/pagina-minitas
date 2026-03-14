export const CLIENT_CONFIG = {
  // Identidad
  nombre: "Hacienda Las Minitas",
  tagline: "Desde 1992, el jardín perfecto para tus momentos más especiales",
  logo: "assets/logo.jpg",

  // Contacto (inmutable — solo el developer edita este archivo)
  telefono: "+52 662 184 7562",
  whatsapp: "526621847562",
  email: "haciendalasminitas@hotmail.com",
  direccion: "Calle de los Molinos #97 (Final), Col. Las Minitas, Hermosillo, Son.",
  maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.8!2d-110.9902715!3d29.0529134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6392cc3ac7b02379:0x0!2sHacienda+Las+Minitas!5e0!3m2!1ses!2smx!4v1234567890",

  // SEO
  seo: {
    title: "Hacienda Las Minitas – Eventos en Hermosillo, Sonora",
    description: "Bodas, XV años, bautizos, graduaciones y más en Hermosillo, Sonora. Jardín, hacienda y área de alberca. Capacidad hasta 600 invitados.",
    keywords: "hacienda las minitas, salon eventos hermosillo, bodas hermosillo sonora, xv años hermosillo, eventos jardin hermosillo, hacienda eventos sonora",
    og_image: "assets/og-image.jpg",
    url_canonica: "https://haciendalasminitas.mx",
    local_business_schema: {
      addressLocality: "Hermosillo",
      addressRegion: "Sonora",
      postalCode: "83285",
      streetAddress: "Calle de los Molinos #97 (Final), Col. Las Minitas"
    }
  },

  // Colores → inyectados como CSS variables en runtime
  colores: {
    primario:       "#1A6B5E",
    primario_claro: "#228B7A",
    acento:         "#C9A265",
    fondo:          "#F8F6F2",
    texto:          "#1A1A1A"
  },

  // Hero
  hero_video_id: null,           // null = usar hero-fallback.jpg
  hero_cta_texto: "Cotiza tu evento",

  // Redes sociales (null = no mostrar ícono)
  redes: {
    facebook:  "https://www.facebook.com/HaciendaLasMinitas/",
    instagram: "https://www.instagram.com/hacienda_minitas/",
    tiktok:    null
  },

  // Estructura de navegación
  nav_eventos:  ["bodas", "xv", "bautizos", "graduacion", "cumpleanos"],
  nav_espacios: ["salon-principal", "jardin", "area-alberca"],

  // Mensaje WhatsApp pre-llenado
  whatsapp_mensaje: "Hola, me interesa cotizar un evento en Hacienda Las Minitas.",

  // Capacidad y horario
  capacidad_min: 100,
  capacidad_max: 600,
  horario_max:   "12:00 AM",
  precio_minimo: null,

  // Paquetes/precios
  paquetes: [
    {
      nombre: "Paquete Jardín",
      precio_por_persona: 220,
      minimo_personas: 100,
      color: "var(--color-surface-alt)",
      incluye: [
        "Renta del jardín y salón",
        "Menú 3 tiempos",
        "Agua y refrescos ilimitados",
        "Pista de baile iluminada",
        "Coordinación de evento",
        "Estacionamiento amplio"
      ]
    },
    {
      nombre: "Paquete Hacienda",
      precio_por_persona: 270,
      minimo_personas: 150,
      destacado: true,
      color: "var(--color-primary)",
      incluye: [
        "Todo lo del Paquete Jardín",
        "Decoración premium personalizada",
        "Menú 4 tiempos",
        "Barra iluminada de bebidas",
        "Mesa de snacks",
        "Área lounge",
        "Coordinador dedicado"
      ]
    },
    {
      nombre: "Paquete Exclusivo",
      precio_por_persona: 320,
      minimo_personas: 200,
      color: "var(--color-surface-alt)",
      incluye: [
        "Todo lo del Paquete Hacienda",
        "Decoración de lujo con flores naturales",
        "Barra libre completa",
        "Pastel incluido",
        "Acceso al área de alberca",
        "Servicio de valet parking",
        "Fotografía del evento (2 horas)"
      ]
    }
  ],

  // Cloudinary (para subida de fotos — configurar al activar el plan completo)
  cloudinary: {
    cloud_name:    "REEMPLAZA_CLOUD_NAME",
    upload_preset: "REEMPLAZA_UPLOAD_PRESET"
  },

  // Meta
  _template_version: "1.0.0",
  _cliente_id: "hacienda-las-minitas"
};
