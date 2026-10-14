// ---- Editá solo este archivo para personalizar la tienda ----

const BUSINESS = {
  name: "Legostun Store",
  whatsapp: "5491122334455" // número con código de país, sin + ni espacios
};

// La imagen es un placeholder de stock (no es el producto real) hasta que cargues las tuyas.
// Para poner tu foto real: reemplazá el valor de "image" por la URL de tu imagen
// (podés subirla a la carpeta del proyecto, ej. "images/auriculares.jpg").
const PRODUCTS = [
  { category: "Tecnología", emoji: "🎧", name: "Auriculares inalámbricos", desc: "Bluetooth 5.0, estuche de carga incluido.", price: 8500, image: "https://picsum.photos/seed/legostun-auriculares/600/600" },
  { category: "Tecnología", emoji: "🔌", name: "Cargador rápido 3 en 1", desc: "Cable USB-C, Lightning y Micro-USB.", price: 4200, image: "https://picsum.photos/seed/legostun-cargador/600/600" },
  { category: "Tecnología", emoji: "📱", name: "Soporte de celular para auto", desc: "Ajuste universal, giro 360°.", price: 3100, image: "https://picsum.photos/seed/legostun-soporte/600/600" },
  { category: "Hogar", emoji: "🧺", name: "Organizador plegable x3", desc: "Para ropa, cajones o estantes.", price: 5600, image: "https://picsum.photos/seed/legostun-organizador/600/600" },
  { category: "Hogar", emoji: "💡", name: "Lámpara LED táctil", desc: "3 tonos de luz, recargable por USB.", price: 4800, image: "https://picsum.photos/seed/legostun-lampara/600/600" },
  { category: "Hogar", emoji: "🧽", name: "Set de limpieza multiuso", desc: "6 piezas, incluye guantes y esponjas.", price: 3900, image: "https://picsum.photos/seed/legostun-limpieza/600/600" },
  { category: "Belleza", emoji: "💆", name: "Masajeador facial de silicona", desc: "Reutilizable, apto para todo tipo de piel.", price: 2800, image: "https://picsum.photos/seed/legostun-masajeador/600/600" },
  { category: "Belleza", emoji: "💅", name: "Kit de manicura portátil", desc: "9 piezas con estuche.", price: 3300, image: "https://picsum.photos/seed/legostun-manicura/600/600" },
  { category: "Accesorios", emoji: "🎒", name: "Mochila impermeable plegable", desc: "Se guarda en su propio bolsillo, 20L.", price: 6200, image: "https://picsum.photos/seed/legostun-mochila/600/600" },
  { category: "Accesorios", emoji: "⌚", name: "Reloj digital deportivo", desc: "Resistente al agua, cronómetro y alarma.", price: 7400, image: "https://picsum.photos/seed/legostun-reloj/600/600" }
];
