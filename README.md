# Legostun Store — sitio web

Catálogo con pedido directo por WhatsApp. Son solo 4 archivos estáticos (sin backend, sin base de datos), así que se puede publicar en cualquier hosting gratuito con tu propio dominio.

## Archivos

- `index.html` — estructura de la página
- `styles.css` — diseño
- `products.js` — **acá editás tu negocio**: nombre, número de WhatsApp y la lista de productos (categoría, emoji, nombre, descripción, precio)
- `app.js` — lógica (no hace falta tocarlo)

## 1. Personalizar

Abrí `products.js` y cambiá:

```js
const BUSINESS = {
  name: "Legostun Store",
  whatsapp: "5491122334455" // tu número con código de país, sin + ni espacios
};
```

Y la lista `PRODUCTS` con tus productos reales.

## 2. Ver cómo queda antes de publicar

No necesitás instalar nada. Hay dos formas:

- Abrí `index.html` haciendo doble clic (funciona, pero el navegador puede bloquear algo por seguridad de archivo local).
- Mejor: si tenés Python instalado, desde esta carpeta corré:
  ```bash
  python -m http.server 8080
  ```
  y abrí `http://localhost:8080` en el navegador.

## 3. Publicarla con tu propio dominio

### Opción recomendada: Netlify (gratis, sin tarjeta)

1. Entrá a https://app.netlify.com/drop
2. Arrastrá esta carpeta completa (`legostun-store-web`) al navegador.
3. En segundos te da un link público (ej. `random-name-123.netlify.app`) ya funcionando.
4. Para poner tu dominio propio: comprás el dominio donde quieras (Namecheap, GoDaddy, NIC Argentina, etc.) y en Netlify vas a **Site settings → Domain management → Add a domain**. Netlify te da las instrucciones exactas (apuntar unos registros DNS) según dónde compraste el dominio.

### Alternativas igual de válidas

- **Vercel** (https://vercel.com) — mismo flujo, conectás un repositorio o arrastrás la carpeta.
- **GitHub Pages** — gratis si subís esta carpeta a un repositorio de GitHub, ideal si en algún momento querés que el sitio crezca con más código.
- **Hosting tradicional con cPanel** — si ya tenés un hosting contratado (por ejemplo con tu dominio de Argentina), solo subís estos 4 archivos por FTP a la carpeta `public_html`.

Cualquiera de estas opciones es gratis o de muy bajo costo (lo único que pagás, en general, es el dominio en sí, unos pocos dólares por año).

## 4. Conectar con el bot de WhatsApp

Si en algún momento armás el bot de respuestas automáticas (carpeta `whatsapp-bot`), poné el link de esta página ya publicada (ej. `https://legostunstore.com`) en el `catalogUrl` de `whatsapp-bot/config.js`, así el bot manda el link real en vez del de prueba.
