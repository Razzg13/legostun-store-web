// ---- Editá solo este archivo para personalizar la tienda ----

const BUSINESS = {
  name: "Legostun Store",
  whatsapp: "5491122334455" // número con código de país, sin + ni espacios
};

// La imagen es una foto de stock de referencia (no es tu producto exacto) hasta que cargues las tuyas.
// Para poner tu foto real: reemplazá el valor de "image" por la URL de tu imagen
// (podés subirla a la carpeta del proyecto, ej. "images/auriculares.jpg").
const PRODUCTS = [
  { category: "Tecnología", emoji: "🎧", name: "Auriculares inalámbricos", desc: "Bluetooth 5.0, estuche de carga incluido.", price: 8500, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Sony-WH-1000XM3-kabellose-Bluetooth-Noise-Cancelling-Kopfhoerer.2.jpg/960px-Sony-WH-1000XM3-kabellose-Bluetooth-Noise-Cancelling-Kopfhoerer.2.jpg" },
  { category: "Tecnología", emoji: "🔌", name: "Cargador rápido 3 en 1", desc: "Cable USB-C, Lightning y Micro-USB.", price: 4200, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Black_charging_cable_type_USB-C_plugs_01.jpg/960px-Black_charging_cable_type_USB-C_plugs_01.jpg" },
  { category: "Tecnología", emoji: "📱", name: "Soporte de celular para auto", desc: "Ajuste universal, giro 360°.", price: 3100, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Smartphone_mounted_on_car_dashboard_during_a_drive_in_a_modern_vehicle_with_a_focus_on_navigation_use.jpg/960px-Smartphone_mounted_on_car_dashboard_during_a_drive_in_a_modern_vehicle_with_a_focus_on_navigation_use.jpg" },
  { category: "Hogar", emoji: "🧺", name: "Organizador plegable x3", desc: "Para ropa, cajones o estantes.", price: 5600, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Orange_plastic_storage_container_on_top_of_a_stack.jpg/960px-Orange_plastic_storage_container_on_top_of_a_stack.jpg" },
  { category: "Hogar", emoji: "💡", name: "Lámpara LED táctil", desc: "3 tonos de luz, recargable por USB.", price: 4800, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Battery_powered_LED_desk_lamp-7420.jpg/960px-Battery_powered_LED_desk_lamp-7420.jpg" },
  { category: "Hogar", emoji: "🧽", name: "Set de limpieza multiuso", desc: "6 piezas, incluye guantes y esponjas.", price: 3900, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Window_cleaner_and_an_empty_spray_bottle.jpg/960px-Window_cleaner_and_an_empty_spray_bottle.jpg" },
  { category: "Belleza", emoji: "💆", name: "Masajeador facial de silicona", desc: "Reutilizable, apto para todo tipo de piel.", price: 2800, image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Gua_sha_tool.jpg" },
  { category: "Belleza", emoji: "💅", name: "Kit de manicura portátil", desc: "9 piezas con estuche.", price: 3300, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Manicure_set_%28AM_1945.90-1%29.jpg/960px-Manicure_set_%28AM_1945.90-1%29.jpg" },
  { category: "Accesorios", emoji: "🎒", name: "Mochila impermeable plegable", desc: "Se guarda en su propio bolsillo, 20L.", price: 6200, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Clothes-travel-voyage-backpack_%2824324553095%29.jpg/960px-Clothes-travel-voyage-backpack_%2824324553095%29.jpg" },
  { category: "Accesorios", emoji: "⌚", name: "Reloj digital deportivo", desc: "Resistente al agua, cronómetro y alarma.", price: 7400, image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Fitbit_Alta_HR.jpg/960px-Fitbit_Alta_HR.jpg" }
];
