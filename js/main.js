/* Game District · sin dependencias. Todo corre en el navegador. */
(() => {
'use strict';

/* ═════════ DATOS EDITABLES ═════════ */
const WHATSAPP = '5219981550080';

// Piezas de referencia del armador (sin precios). Edita, agrega o quita libremente.
// s = socket · w = consumo pico en watts · ig = tiene gráficos integrados · rec = fuente recomendada
const PARTS = {
  cpu: { n: 'Procesador', o: [
    { id: 'r5-5600g', n: 'Ryzen 5 5600G', t: '5600G', s: 'AM4', w: 88, ig: 1 },
    { id: 'r5-5600', n: 'Ryzen 5 5600', t: '5600', s: 'AM4', w: 76 },
    { id: 'r7-5700x', n: 'Ryzen 7 5700X', t: '5700X', s: 'AM4', w: 76 },
    { id: 'r5-7600', n: 'Ryzen 5 7600', t: '7600', s: 'AM5', w: 88, ig: 1 },
    { id: 'r5-9600x', n: 'Ryzen 5 9600X', t: '9600X', s: 'AM5', w: 88, ig: 1 },
    { id: 'r7-7800x3d', n: 'Ryzen 7 7800X3D', t: '7800X3D', s: 'AM5', w: 162, ig: 1 },
    { id: 'r7-9800x3d', n: 'Ryzen 7 9800X3D', t: '9800X3D', s: 'AM5', w: 162, ig: 1 },
    { id: 'i5-12400f', n: 'Core i5-12400F', t: '12400F', s: 'LGA1700', w: 117 },
    { id: 'i5-14600k', n: 'Core i5-14600K', t: '14600K', s: 'LGA1700', w: 181, ig: 1 },
    { id: 'i7-14700k', n: 'Core i7-14700K', t: '14700K', s: 'LGA1700', w: 253, ig: 1 },
    { id: 'u5-245k', n: 'Core Ultra 5 245K', t: '245K', s: 'LGA1851', w: 159, ig: 1 },
    { id: 'u7-265k', n: 'Core Ultra 7 265K', t: '265K', s: 'LGA1851', w: 250, ig: 1 } ] },
  mobo: { n: 'Tarjeta madre', o: [
    { id: 'b550', n: 'B550 (AM4, DDR4)', s: 'AM4', r: 'DDR4' },
    { id: 'b650', n: 'B650 (AM5, DDR5)', s: 'AM5', r: 'DDR5' },
    { id: 'x870', n: 'X870 (AM5, DDR5)', s: 'AM5', r: 'DDR5' },
    { id: 'b760d4', n: 'B760 (LGA1700, DDR4)', s: 'LGA1700', r: 'DDR4' },
    { id: 'b760d5', n: 'B760 (LGA1700, DDR5)', s: 'LGA1700', r: 'DDR5' },
    { id: 'z790', n: 'Z790 (LGA1700, DDR5)', s: 'LGA1700', r: 'DDR5' },
    { id: 'b860', n: 'B860 (LGA1851, DDR5)', s: 'LGA1851', r: 'DDR5' },
    { id: 'z890', n: 'Z890 (LGA1851, DDR5)', s: 'LGA1851', r: 'DDR5' } ] },
  ram: { n: 'Memoria RAM', o: [
    { id: 'd4-16', n: '16 GB DDR4', r: 'DDR4' }, { id: 'd4-32', n: '32 GB DDR4', r: 'DDR4', x4: 1 },
    { id: 'd5-16', n: '16 GB DDR5', r: 'DDR5' }, { id: 'd5-32', n: '32 GB DDR5', r: 'DDR5' }, { id: 'd5-64', n: '64 GB DDR5', r: 'DDR5', x4: 1 } ] },
  gpu: { n: 'Tarjeta de video', o: [
    { id: 'none', n: 'Sin tarjeta dedicada', w: 0, rec: 0, none: 1 },
    { id: 'rx7600', n: 'Radeon RX 7600', w: 165, rec: 550 },
    { id: 'rtx5060', n: 'GeForce RTX 5060', w: 145, rec: 550 },
    { id: 'rx9060xt', n: 'Radeon RX 9060 XT', w: 160, rec: 550 },
    { id: 'rtx5060ti', n: 'GeForce RTX 5060 Ti', w: 180, rec: 600 },
    { id: 'rtx5070', n: 'GeForce RTX 5070', w: 220, rec: 650, x3: 1 },
    { id: 'rx9070xt', n: 'Radeon RX 9070 XT', w: 304, rec: 750, x3: 1 },
    { id: 'rtx5070ti', n: 'GeForce RTX 5070 Ti', w: 300, rec: 750, x3: 1 },
    { id: 'rtx5080', n: 'GeForce RTX 5080', w: 360, rec: 850, x3: 1 },
    { id: 'rtx5090', n: 'GeForce RTX 5090', w: 575, rec: 1000, x3: 1 } ] },
  ssd: { n: 'Almacenamiento', o: [
    { id: 's500', n: 'SSD M.2 500 GB' }, { id: 's1', n: 'SSD M.2 1 TB' }, { id: 's2', n: 'SSD M.2 2 TB' }, { id: 's4', n: 'SSD M.2 4 TB' } ] },
  psu: { n: 'Fuente de poder', o: [550, 650, 750, 850, 1000, 1200].map(v => ({ id: 'p' + v, n: v + ' W', v })) },
  cooler: { n: 'Enfriamiento', o: [
    { id: 'air', n: 'Aire', max: 180 }, { id: 'aio240', n: 'Líquido 240 mm', aio: 1, max: 260 }, { id: 'aio360', n: 'Líquido 360 mm', aio: 1, x360: 1, max: 400 } ] },
  case: { n: 'Gabinete', o: [
    { id: 'negro', n: 'Negro, cristal lateral' }, { id: 'blanco', n: 'Blanco, cristal lateral' }, { id: 'panoramico', n: 'Panorámico' } ] },
};

const USES = [['esports', 'Fortnite, Valorant, Roblox'], ['aaa', 'Warzone y juegos pesados'], ['stream', 'Streaming'], ['edit', 'Edición y diseño'], ['work', 'Escuela y trabajo']];
const RES = [['1080', '1080p'], ['1440', '1440p'], ['4k', '4K']];

// Puntos de partida de "Ayúdame a elegir". min = presupuesto desde el que se sugiere (MXN, orientativo).
const TIERS = [
  { min: 0, n: 'PC Gamer Inicial', d: 'Para entrar al juego con gráficos integrados y espacio para crecer.', res: ['1080'], p: { cpu: 'r5-5600g', mobo: 'b550', ram: 'd4-16', gpu: 'none', ssd: 's500', psu: 'p650', cooler: 'air', case: 'negro' } },
  { min: 17000, n: 'PC 1080p', d: 'Tu primera tarjeta de video dedicada, lista para los competitivos.', res: ['1080'], p: { cpu: 'r5-5600', mobo: 'b550', ram: 'd4-16', gpu: 'rtx5060', ssd: 's500', psu: 'p650', cooler: 'air', case: 'negro' } },
  { min: 25000, n: 'PC 1080p Ultra', d: 'Todo en alto a 1080p y plataforma AM5 para mejorarla después.', res: ['1080', '1440'], p: { cpu: 'r5-7600', mobo: 'b650', ram: 'd5-16', gpu: 'rtx5060ti', ssd: 's1', psu: 'p650', cooler: 'air', case: 'negro' } },
  { min: 35000, n: 'PC 1440p', d: 'El punto dulce para jugar nítido y con muchos cuadros.', res: ['1080', '1440'], p: { cpu: 'r5-9600x', mobo: 'b650', ram: 'd5-32', gpu: 'rtx5070', ssd: 's1', psu: 'p750', cooler: 'aio240', case: 'negro' } },
  { min: 47000, n: 'PC Streaming', d: 'Juega y transmite al mismo tiempo sin que se sienta.', res: ['1080', '1440', '4k'], p: { cpu: 'r7-7800x3d', mobo: 'x870', ram: 'd5-32', gpu: 'rtx5070ti', ssd: 's2', psu: 'p850', cooler: 'aio360', case: 'panoramico' } },
  { min: 66000, n: 'PC 4K', d: 'La bestia del local: 4K, streaming y edición pesada.', res: ['1080', '1440', '4k'], p: { cpu: 'r7-9800x3d', mobo: 'x870', ram: 'd5-64', gpu: 'rtx5080', ssd: 's2', psu: 'p1000', cooler: 'aio360', case: 'panoramico' } },
];

const K = '#050507', I = '#4e27d8', V = '#8c33ff', L = '#c3a6ff', W = '#fff', D = '#1c1444';
const ic = s => `<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="${K}" stroke-width="3.500" stroke-linejoin="miter">${s}</g></svg>`;
const fan = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}"/><path d="M${x} ${y}m0 -${r * .25}c${r * .5} -${r * .6} ${r * .8} 0 ${r * .25} ${r * .25}c${r * .6} ${r * .5} 0 ${r * .8} -${r * .25} ${r * .25}c-${r * .5} ${r * .6} -${r * .8} 0 -${r * .25} -${r * .25}c-${r * .6} -${r * .5} 0 -${r * .8} ${r * .25} -${r * .25}z" fill="${L}" stroke="none"/>`;
const CATS = [
  { id: 'gpu', n: 'Tarjetas de video', h: 'GeForce y Radeon', c: 'tile--big', s: ic(`<path d="M6 30H88L96 38V76H14L6 68Z" fill="${I}"/><path d="M6 30H88L92 34H6Z" fill="${V}"/><path d="M2 24H8V86H2Z" fill="${L}"/>${fan(31, 55, 16)}${fan(69, 55, 16)}<path d="M18 76H52V82H18Z" fill="${W}"/><path d="M46 44h8l-4 5zM46 66h8l-4-5z" fill="${W}" stroke="none"/>`) },
  { id: 'cpu', n: 'Procesadores', h: 'AMD e Intel', s: ic(`<path d="M22 16V84M36 14V86M50 14V86M64 14V86M78 16V84M14 22H86M14 36H86M14 50H86M14 64H86M14 78H86" stroke="${L}" stroke-width="4"/><path d="M20 20H80V80H20Z" fill="${I}"/><path d="M31 31H69V69H31Z" fill="${W}"/><path d="M41 43H59L50 58Z" fill="${V}" stroke="none"/><path d="M20 20h11l-11 11z" fill="${V}"/>`) },
  { id: 'mobo', n: 'Tarjetas madre', h: 'ATX, Micro ATX, Mini ITX', s: ic(`<path d="M14 10H86V90H14Z" fill="${I}"/><path d="M26 22H54V50H26Z" fill="${L}"/><path d="M62 18H67V56H62ZM73 18H78V56H73Z" fill="${W}"/><path d="M24 62H76V68H24ZM24 76H60V82H24Z" fill="${V}"/><path d="M66 74H78V84H66Z" fill="${D}"/>`) },
  { id: 'ram', n: 'Memoria RAM', h: 'DDR4 y DDR5', s: ic(`<path d="M6 34H94V64H56L52 70 48 64H6Z" fill="${I}"/><path d="M6 24H94V36H6Z" fill="${V}"/><path d="M16 42H30V56H16ZM36 42H50V56H36ZM56 42H70V56H56ZM76 42H88V56H76Z" fill="${W}"/>`) },
  { id: 'ssd', n: 'Almacenamiento', h: 'SSD M.2, SATA y discos', s: ic(`<path d="M18 14H82V86H18Z" fill="${I}"/><path d="M28 24H72V52H28Z" fill="${W}"/><path d="M40 31H60L50 45Z" fill="${V}" stroke="none"/><path d="M28 62H72V68H28ZM28 74H54V80H28Z" fill="${L}"/>`) },
  { id: 'psu', n: 'Fuentes de poder', h: 'Dinos watts y certificación', s: ic(`<path d="M10 24H90V80H10Z" fill="${I}"/>${fan(40, 52, 22)}<path d="M70 34H82V44H70Z" fill="${W}"/><path d="M70 54H82M70 62H82M70 70H82" stroke="${L}" stroke-width="4"/>`) },
  { id: 'case', n: 'Gabinetes', h: 'Cristal, blanco, panorámico', s: ic(`<path d="M22 8H78V92H22Z" fill="${I}"/><path d="M30 16H60V74H30Z" fill="${D}"/>${fan(45, 32, 11)}${fan(45, 58, 11)}<path d="M66 16H72V74H66Z" fill="${V}"/><path d="M30 80H72V86H30Z" fill="${L}"/>`) },
  { id: 'cooler', n: 'Enfriamiento', h: 'Aire y líquido', c: 'tile--mid', s: ic(`<path d="M58 34C76 30 80 46 78 62" fill="none" stroke="${K}" stroke-width="11"/><path d="M58 34C76 30 80 46 78 62" fill="none" stroke="${L}" stroke-width="4"/><circle cx="40" cy="36" r="26" fill="${I}"/><circle cx="40" cy="36" r="17" fill="${D}"/><path d="M31 30H49L40 44Z" fill="${V}" stroke="none"/><path d="M14 68H92V90H14Z" fill="${V}"/><path d="M22 74V84M32 74V84M42 74V84M52 74V84M62 74V84M72 74V84M82 74V84" stroke="${W}" stroke-width="3"/>`) },
  { id: 'monitor', n: 'Monitores', h: 'Dinos pulgadas y Hz', c: 'tile--wide', s: ic(`<path d="M6 14H94V68H6Z" fill="${I}"/><path d="M13 21H87V61H13Z" fill="${D}"/><path d="M13 61 40 34 54 48 70 28 87 46V61Z" fill="${V}" stroke="none"/><path d="M42 68H58V80H42Z" fill="${L}"/><path d="M28 80H72V88H28Z" fill="${W}"/>`) },
  { id: 'perif', n: 'Periféricos', h: 'Teclados, mouse, audífonos, controles', c: 'tile--big tile--perif', s: ic(`<path d="M22 44C22 12 66 12 66 44" fill="none" stroke="${K}" stroke-width="12"/><path d="M22 44C22 12 66 12 66 44" fill="none" stroke="${L}" stroke-width="5"/><path d="M14 40H28V62H14ZM60 40H74V62H60Z" fill="${V}"/><path d="M4 66H74V92H4Z" fill="${I}"/><path d="M10 72H18V78H10ZM22 72H30V78H22ZM34 72H42V78H34ZM46 72H54V78H46ZM58 72H68V78H58ZM10 82H16V88H10ZM20 82H56V88H20ZM60 82H68V88H60Z" fill="${W}" stroke-width="1.500"/><path d="M80 60C92 60 96 68 96 78C96 90 92 94 87 94C82 94 78 90 78 78C78 68 78 60 80 60Z" fill="${I}"/><path d="M87 62V74" stroke="${W}" stroke-width="3"/>`) },
  { id: 'silla', n: 'Sillas', h: 'Pregunta modelos', c: 'tile--mid', s: ic(`<path d="M32 8H68L74 52H26Z" fill="${I}"/><path d="M44 8H56V52H44Z" fill="${V}"/><path d="M20 52H80V64H20Z" fill="${L}"/><path d="M12 36H22V56H12ZM78 36H88V56H78Z" fill="${D}"/><path d="M46 64H54V80H46Z" fill="${W}"/><path d="M22 90 50 76 78 90" fill="none" stroke="${K}" stroke-width="8"/><circle cx="22" cy="91" r="5" fill="${V}"/><circle cx="78" cy="91" r="5" fill="${V}"/><circle cx="50" cy="91" r="5" fill="${V}"/>`) },
];
const SERVICES = [
  { id: 'ensamble', n: 'Ensamble', d: 'Gratis al comprar tus componentes con nosotros.' },
  { id: 'mantenimiento', n: 'Mantenimiento', d: 'Limpieza y cambio de pasta térmica para que no se ahogue.' },
  { id: 'reparacion', n: 'Reparación', d: 'Diagnóstico y arreglo cuando no prende, se apaga o se traba.' },
  { id: 'domicilio', n: 'Servicio a domicilio', d: 'Vamos a donde estás. Consulta tu ubicación.' },
  { id: 'upgrade', n: 'Upgrade y asesoría', d: 'Te decimos qué pieza cambiar para que rinda más.' },
  { id: 'software', n: 'Windows y drivers', d: 'Instalación y drivers al día, lista para jugar.' },
];

// Reseñas inventadas para ver el diseño. Al poner las reales, cambia RESENAS_DEMO a false.
const RESENAS_DEMO = true;
const RESENAS = [
  { n: 'Diego M.', d: 'Armó su PC 1440p', t: 'Llegué con un presupuesto y salí con la PC lista. Me explicaron cada pieza y no me quisieron vender de más.' },
  { n: 'Fernanda R.', d: 'PC para streaming', t: 'Transmito en vivo sin que se trabe nada. Además quedó hermosa con las luces moradas.' },
  { n: 'Luis Ángel C.', d: 'Mantenimiento', t: 'Mi compu sonaba a avión. Pasaron por ella a mi casa y al otro día ya estaba limpia y fresca.' },
  { n: 'Karla P.', d: 'Setup completo', t: 'Teclado, mouse, audífonos y silla en una sola vuelta. Todo combinado y con buena atención.' },
  { n: 'Iván T.', d: 'Upgrade de tarjeta', t: 'Cambié mi tarjeta de video y revisaron que la fuente aguantara. Ahora Warzone va volando.' },
  { n: 'Sofía G.', d: 'Su primera PC', t: 'No sabía nada de computadoras. Coticé por WhatsApp y me contestaron todas mis dudas.' },
  { n: 'Emiliano V.', d: 'Reparación', t: 'En otro lado me dijeron que ya no servía. Aquí le encontraron la falla y quedó como nueva.' },
  { n: 'Paola H.', d: 'PC para edición', t: 'Edito video y los renders bajaron muchísimo. El cableado quedó impecable.' },
  { n: 'Rodrigo S.', d: 'Enfriamiento líquido', t: 'Le pusieron el gatito en la pantalla del enfriamiento. Es lo primero que todos me preguntan.' },
  { n: 'Mariana L.', d: 'Regalo de cumpleaños', t: 'Se la armé a mi hijo. Me ayudaron a escoger según sus juegos y la entregaron a tiempo.' },
];

/* ═════════ UTILIDADES ═════════ */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = n => '$' + Number(n).toLocaleString('es-MX');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const find = (k, id) => PARTS[k].o.find(o => o.id === id);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* modo privado */ } },
};
const waLink = t => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
let toastT;
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); };

/* ═════════ HERO: símbolos flotantes ═════════ */
(() => {
  const cv = $('#floats'), hero = $('.hero'), logo = $('#logo'), ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, items = [], run = false, t0 = performance.now(), mx = -9e3, my = -9e3, nx = 0, ny = 0, raf = 0;
  const C = ['#8c33ff', '#5d17eb', '#4e27d8', '#5fd0ff', '#ffffff'];
  const draw = {
    x(s) { const a = s, b = s * .42; ctx.beginPath(); for (const [x, y] of [[-a, -a + b], [-a + b, -a], [0, -b], [a - b, -a], [a, -a + b], [b, 0], [a, a - b], [a - b, a], [0, b], [-a + b, a], [-a, a - b], [-b, 0]]) ctx.lineTo(x, y); ctx.fill(); },
    tri(s) { ctx.beginPath(); ctx.moveTo(-s, -s * .55); ctx.lineTo(s, -s * .55); ctx.lineTo(0, s * .5); ctx.fill(); },
    triO(s) { ctx.beginPath(); ctx.moveTo(-s, s * .8); ctx.lineTo(0, -s * .9); ctx.lineTo(s, s * .8); ctx.closePath(); ctx.lineWidth = s * .26; ctx.stroke(); },
    ring(s) { ctx.beginPath(); ctx.arc(0, 0, s * .9, 0, 7); ctx.lineWidth = s * .26; ctx.stroke(); },
    sq(s) { ctx.lineWidth = s * .26; ctx.strokeRect(-s * .8, -s * .8, s * 1.6, s * 1.6); },
    ball(s) { ctx.beginPath(); ctx.arc(0, 0, s * .5, 0, 7); ctx.fill(); },
    pad(s) { const b = s * .34; ctx.beginPath(); for (const [x, y] of [[-b, -s], [b, -s], [b, -b], [s, -b], [s, b], [b, b], [b, s], [-b, s], [-b, b], [-s, b], [-s, -b], [-b, -b]]) ctx.lineTo(x, y); ctx.fill(); },
    ctrl(s) { // control
      ctx.beginPath(); ctx.moveTo(-s * .7, -s * .62); ctx.lineTo(s * .7, -s * .62); ctx.bezierCurveTo(s * 1.25, -s * .6, s * 1.6, s * .9, s * 1.15, s * .9); ctx.bezierCurveTo(s * .85, s * .9, s * .7, s * .3, s * .4, s * .3); ctx.lineTo(-s * .4, s * .3); ctx.bezierCurveTo(-s * .7, s * .3, -s * .85, s * .9, -s * 1.15, s * .9); ctx.bezierCurveTo(-s * 1.6, s * .9, -s * 1.25, -s * .6, -s * .7, -s * .62); ctx.fill();
      ctx.fillStyle = '#07031f'; ctx.fillRect(-s * .85, -s * .28, s * .46, s * .15); ctx.fillRect(-s * .695, -s * .435, s * .15, s * .46);
      for (const [x, y] of [[.62, -.42], [.62, 0], [.41, -.21], [.83, -.21]]) { ctx.beginPath(); ctx.arc(x * s, y * s, s * .1, 0, 7); ctx.fill(); } },
    bar(s) { ctx.fillRect(-s * 2.4, -s * .16, s * 4.8, s * .32); },
    line(s) { ctx.fillRect(-s * 2.6, -1, s * 5.2, 2); },
    key(s) { ctx.lineWidth = s * .2; ctx.strokeRect(-s * .8, -s * .8, s * 1.6, s * 1.6); ctx.fillRect(-s * .34, -s * .34, s * .68, s * .56); },
  };
  // [tipo, x, y (0–1), tamaño, profundidad, color, giro fijo]
  const SET = [
    ['x', .085, .2, 34, 1.1, 1], ['x', .725, .13, 24, .8, 0], ['bar', .955, .1, 40, 1, 0, -.785], ['line', .9, .12, 34, .9, 1, -.785], ['line', .86, .24, 14, .5, 0, 0],
    ['bar', .03, .7, 34, 1, 0, -.785], ['line', .06, .7, 34, 1, 3, -.785], ['line', .07, .58, 14, .5, 0, 0],
    ['tri', .2, .36, 22, .9, 0], ['tri', .9, .62, 30, 1.2, 0], ['tri', .33, .12, 11, .4, 1], ['triO', .145, .54, 21, 1, 4], ['triO', .72, .22, 13, .5, 3],
    ['ring', .83, .42, 25, 1.1, 3], ['ring', .25, .16, 13, .5, 0], ['ring', .06, .4, 15, .6, 1], ['sq', .93, .36, 18, .8, 0], ['sq', .28, .62, 11, .5, 3],
    ['ctrl', .14, .64, 36, 1.3, 0], ['ctrl', .87, .74, 25, .9, 1], ['pad', .77, .62, 20, .8, 1], ['pad', .2, .13, 15, .6, 0], ['key', .715, .68, 14, .6, 1], ['key', .235, .7, 15, .6, 0],
    ['ball', .18, .26, 12, .5, 3], ['ball', .73, .46, 10, .4, 4], ['ball', .27, .46, 10, .4, 0], ['ball', .96, .5, 18, 1, 0], ['ball', .4, .07, 9, .3, 3], ['ball', .62, .1, 9, .4, 0], ['ball', .31, .7, 8, .4, 4], ['ball', .7, .72, 11, .5, 1], ['ball', .03, .3, 9, .4, 4], ['ball', .82, .33, 7, .3, 4], ['x', .965, .74, 18, .7, 1], ['x', .285, .56, 9, .4, 4], ['x', .69, .33, 8, .3, 0], ['tri', .035, .22, 12, .4, 0], ['ball', .13, .46, 6, .3, 3], ['ball', .88, .54, 6, .3, 4],
  ];
  const org = () => { const b = $('#heroCat').getBoundingClientRect(), h = hero.getBoundingClientRect(); return [b.left - h.left + b.width / 2, b.top - h.top + b.height / 2]; };
  function size() {
    W = hero.clientWidth; H = hero.clientHeight; dpr = Math.min(devicePixelRatio || 1, 2); cv.width = W * dpr; cv.height = H * dpr;
    const small = W < 700, k = small ? .62 : Math.min(1.25, Math.max(.8, W / 1440)), [ox, oy] = org();
    items = SET.filter((_, i) => !small || i % 5 !== 4).map(([k2, x, y, s, z, c, r], i) => {
      const old = items[i] || {};
      // en teléfono se abren hacia las orillas y se quedan en la zona del logo
      let px = x, py = y; if (W < 1020) { const q = small ? .36 : .44; px = x < .5 ? x * q - .01 : 1.01 - (1 - x) * q; py = .08 + y * .6; }
      return { k: k2, hx: px * W, hy: py * H, x: old.x ?? ox, y: old.y ?? oy, vx: old.vx || 0, vy: old.vy || 0, s: s * k, z, c: C[c], fix: r, rot: r ?? ((i * 1.7) % 6.28), vr: (i % 2 ? 1 : -1) * (.08 + (i % 5) * .05), p: i * 1.37, live: old.live || false, a: old.a || 0 };
    });
  }
  function burst(f) { const [ox, oy] = org(); for (const o of items) { const dx = o.x - ox || (Math.random() - .5), dy = o.y - oy || (Math.random() - .5), d = Math.hypot(dx, dy) + 1; const p = f * (.6 + Math.random() * .8); o.vx += dx / d * p; o.vy += dy / d * p; } }
  function frame(now) {
    raf = 0; const t = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const sc = scrollY;
    for (const o of items) {
      if (!o.live && t > 1.42 + (o.p % .25)) { o.live = true; }
      if (o.live) {
        o.a = Math.min(1, o.a + .06);
        const tx = o.hx + Math.sin(t * .55 + o.p) * 16 * o.z + nx * 34 * o.z, ty = o.hy + Math.cos(t * .5 + o.p * 1.3) * 18 * o.z + ny * 26 * o.z;
        o.vx += (tx - o.x) * .02; o.vy += (ty - o.y) * .02;
        const dx = o.x - mx, dy = o.y - my, d2 = dx * dx + dy * dy, R = 130;
        if (d2 < R * R) { const d = Math.sqrt(d2) + .01, f = (1 - d / R) * 2.6; o.vx += dx / d * f; o.vy += dy / d * f; }
        o.vx *= .87; o.vy *= .87; o.x += o.vx; o.y += o.vy;
        if (o.fix === undefined) o.rot += o.vr / 60 + (o.vx) * .002;
      }
      if (o.a <= 0) continue;
      ctx.save(); ctx.translate(o.x, o.y - sc * .22 * o.z); ctx.rotate(o.rot);
      ctx.globalAlpha = o.a * (.45 + Math.min(.55, o.z * .5)); ctx.fillStyle = ctx.strokeStyle = o.c; draw[o.k](o.s); ctx.restore();
    }
    if (run) raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
  size();
  if (still) { for (const o of items) { o.x = o.hx; o.y = o.hy; o.a = 1; } frame(performance.now()); addEventListener('resize', () => { size(); for (const o of items) { o.x = o.hx; o.y = o.hy; o.a = 1; } frame(performance.now()); }); return; }
  new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) start(); }).observe(hero);
  addEventListener('resize', size);
  hero.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; nx = mx / W - .5; ny = my / H - .5; logo.style.setProperty('--mx', nx * 2); logo.style.setProperty('--my', ny * 2); }, { passive: true });
  hero.addEventListener('pointerleave', () => { mx = my = -9e3; });
  // El rugido usa WAAPI para no reiniciar la animación de entrada
  $('#roar').addEventListener('click', () => {
    $('.cat__in', logo).animate([{ transform: 'none' }, { transform: 'scale(.92)', offset: .18 }, { transform: 'scale(1.16) rotate(-2deg)', offset: .38 }, { transform: 'scale(1.15) rotate(2.5deg)', offset: .48 }, { transform: 'scale(1.14) rotate(-2deg)', offset: .58 }, { transform: 'scale(1.1)', offset: .7 }, { transform: 'none' }], 800);
    $$('.ring circle', logo).forEach((c, i) => c.animate([{ transform: 'scale(.4)', opacity: .95 }, { transform: 'scale(4.2)', opacity: 0 }], { duration: 1100, delay: 220 + i * 120, easing: 'cubic-bezier(.1,.7,.3,1)' }));
    $$('.gl', logo).forEach((l, i) => l.animate([{ transform: 'none' }, { transform: 'translateY(10px) scaleY(.92)', offset: .3 }, { transform: 'none' }], { duration: 500, delay: 280 + i * 30, easing: 'ease-out' }));
    setTimeout(() => burst(W < 700 ? 18 : 42), 280);
  });
})();

/* ═════════ ARMADOR ═════════ */
const build = Object.assign({}, store.get('gd_build', {}));
for (const k in build) if (!PARTS[k] || !find(k, build[k])) delete build[k];
const g = { uses: ['esports'], res: '1080', budget: 36000 };
const sel = b => Object.fromEntries(Object.keys(PARTS).map(k => [k, b[k] ? find(k, b[k]) : null]));

function check(b) {
  const p = sel(b), w = [], bad = new Set();
  const watts = (p.cpu?.w || 0) + (p.gpu?.w || 0) + (p.cpu || p.gpu ? 100 : 0);
  const need = Math.max(p.gpu?.rec || 0, Math.ceil(watts * 1.25 / 50) * 50);
  if (p.cpu && p.mobo && p.cpu.s !== p.mobo.s) { w.push(`El ${p.cpu.n} usa socket ${p.cpu.s} y esa tarjeta madre es ${p.mobo.s}.`); bad.add('mobo'); }
  if (p.mobo && p.ram && p.mobo.r !== p.ram.r) { w.push(`Esa tarjeta madre lleva ${p.mobo.r} y escogiste ${p.ram.r}.`); bad.add('ram'); }
  if (p.gpu?.none && p.cpu && !p.cpu.ig) { w.push(`El ${p.cpu.n} no trae gráficos: necesita tarjeta de video para dar imagen.`); bad.add('gpu'); }
  if (p.psu && watts && p.psu.v < need) { w.push(`La fuente de ${p.psu.v} W se queda corta. Con estas piezas conviene de ${need} W o más.`); bad.add('psu'); }
  if (p.cooler && p.cpu && p.cpu.w > p.cooler.max) { w.push(`El ${p.cpu.n} calienta: le conviene enfriamiento líquido.`); bad.add('cooler'); }
  return { w, bad, watts, need, p };
}
function optionBad(k, id) { const c = check({ ...build, [k]: id }); return c.bad.has(k) || (k === 'cpu' && c.bad.has('mobo')); }

function drawPC(b) {
  const p = sel(b), pc = $('#pc');
  for (const k in PARTS) {
    const el = $(`[data-part=${k}]`, pc); el.classList.toggle('on', !!p[k] && !p[k].none);
    for (const f of ['x4', 'x3', 'x360']) el.classList.toggle(f, !!p[k]?.[f]);
    if (k === 'cooler') { el.classList.toggle('aio', !!p[k]?.aio); el.classList.toggle('air', !!p[k] && !p[k].aio); }
  }
  pc.dataset.case = p.case?.id || 'negro';
  $('#pcCpu').textContent = p.cpu?.t || ''; $('#pcPsu').textContent = p.psu ? p.psu.v + 'W' : '';
}

const slots = $('#slots');
slots.innerHTML = Object.entries(PARTS).map(([k, v]) => `<details class="slotrow" name="slots" data-k="${k}"><summary><span>${v.n}</span><b></b></summary><div class="chips" role="radiogroup" aria-label="${v.n}">${v.o.map(o => `<label class="chip"><input type="radio" name="p-${k}" value="${o.id}"><span>${o.n}</span></label>`).join('')}</div></details>`).join('');
slots.addEventListener('change', e => {
  const k = e.target.closest('[data-k]').dataset.k; build[k] = e.target.value; renderBuild();
  const row = e.target.closest('details'), next = $$('details', slots).find(d => !build[d.dataset.k]);
  if (next && e.isTrusted && !check(build).bad.has(k)) { setTimeout(() => { row.open = false; next.open = true; }, 260); }
});
function renderBuild() {
  store.set('gd_build', build);
  const c = check(build);
  $$('details', slots).forEach(d => {
    const k = d.dataset.k; $('b', d).textContent = c.p[k]?.n || 'Elegir'; d.classList.toggle('bad', c.bad.has(k));
    $$('.chip', d).forEach(l => { const i = $('input', l); i.checked = build[k] === i.value; l.classList.toggle('bad', optionBad(k, i.value)); });
  });
  const n = Object.keys(build).length, cap = c.p.psu?.v || 0;
  $('#status').innerHTML = `<div class="status__w"><span>Consumo estimado</span><b>${c.watts} W</b></div><div class="meter${cap && cap < c.need ? ' bad' : ''}"><i style="--v:${Math.min(1, c.watts / (cap || 1000))}"></i></div>` +
    (c.w.length ? c.w.map(x => `<p class="warn"><svg aria-hidden="true"><use href="#i-x"/></svg>${x}</p>`).join('') :
      n > 1 ? `<p class="ok"><svg aria-hidden="true"><use href="#i-check"/></svg>Todo compatible. ${c.need ? `Fuente sugerida: ${c.need} W o más.` : ''}</p>` : '<p>Escoge tus piezas y aquí te avisamos si algo no cuadra.</p>');
  drawPC(build);
}

/* ── Ayúdame a elegir ── */
const chips = (arr, name, type, on) => arr.map(([v, n]) => `<label class="chip"><input type="${type}" name="${name}" value="${v}" ${on.includes(v) ? 'checked' : ''}><span>${n}</span></label>`).join('');
$('#uses').innerHTML = chips(USES, 'use', 'checkbox', g.uses); $('#res').innerHTML = chips(RES, 'res', 'radio', [g.res]);
function tier() { return [...TIERS].reverse().find(t => g.budget >= t.min); }
function renderGuided() {
  const t = tier(), p = sel(t.p), notes = [], at = n => TIERS.find(x => x.n === n).min;
  if (!t.res.includes(g.res)) { const up = TIERS.find(x => x.res.includes(g.res)); notes.push(`Para ${RES.find(r => r[0] === g.res)[1]} te conviene subir a unos ${money(up.min)}, o jugar a 1080p con esta.`); }
  if (g.uses.includes('aaa') && t.min < at('PC 1080p')) notes.push('Para juegos pesados vas a querer tarjeta de video dedicada.');
  if ((g.uses.includes('stream') || g.uses.includes('edit')) && t.min < at('PC 1440p')) notes.push('Para transmitir o editar pide 32 GB de RAM desde el inicio.');
  if (g.uses.length === 1 && g.uses[0] === 'work' && t.min > at('PC 1080p')) notes.push('Para escuela y trabajo te alcanza con menos. Te lo decimos de una vez.');
  $('#sug').innerHTML = `<h3>${t.n}</h3><p>${t.d}</p><ul>${['cpu', 'gpu', 'ram', 'ssd', 'mobo', 'psu'].map(k => `<li>${k === 'psu' ? 'Fuente ' : ''}${p[k].none ? 'Gráficos integrados' : p[k].n}</li>`).join('')}</ul>${notes.map(n => `<p class="warn"><svg aria-hidden="true"><use href="#i-x"/></svg>${n}</p>`).join('')}`;
  const r = $('#budget'); $('#budgetOut').textContent = money(g.budget) + (g.budget >= +r.max ? ' o más' : ''); r.setAttribute('aria-valuetext', money(g.budget) + ' pesos'); r.style.setProperty('--p', (g.budget - r.min) / (r.max - r.min) * 100 + '%');
  if (mode === 'g') drawPC(t.p);
}
let mode = 'g';
$('#uses').addEventListener('change', () => { g.uses = $$('#uses input:checked').map(i => i.value); renderGuided(); });
$('#res').addEventListener('change', e => { g.res = e.target.value; renderGuided(); });
$('#budget').addEventListener('input', e => { g.budget = +e.target.value; renderGuided(); });

/* ── Pestañas ── */
const tabs = $$('[role=tab]');
function setTab(m, focus) { mode = m; tabs.forEach(t => { const on = t.id === 'tab-' + m; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !on; if (on && focus) t.focus(); }); m === 'g' ? renderGuided() : renderBuild(); }
tabs.forEach(t => t.addEventListener('click', () => setTab(t.id.slice(-1))));
$('.tabs').addEventListener('keydown', e => { if (/^Arrow(Left|Right)$/.test(e.key)) { e.preventDefault(); setTab(mode === 'g' ? 'b' : 'g', true); } });
$('#toBuilder').addEventListener('click', () => { Object.assign(build, tier().p); setTab('b', true); });
$('#resetBuild').addEventListener('click', () => { for (const k in build) delete build[k]; renderBuild(); });

/* ── Luces ── */
let light = 'Morado';
$$('.rgb input').forEach(i => i.addEventListener('change', () => { const pc = $('#pc'); light = i.dataset.n; pc.classList.toggle('rain', i.value === 'rainbow' && !still); if (i.value !== 'rainbow') pc.style.setProperty('--rgb', i.value); }));
if (!still && matchMedia('(hover:hover)').matches) { const v = $('.rig__view'), pc = $('#pc'); v.addEventListener('pointermove', e => { const r = v.getBoundingClientRect(); pc.style.setProperty('--rx', (e.clientX - r.left) / r.width * 2 - 1); pc.style.setProperty('--ry', Math.max(-1, Math.min(1, (e.clientY - innerHeight / 2) / innerHeight * 2))); }); v.addEventListener('pointerleave', () => { pc.style.setProperty('--rx', 0); pc.style.setProperty('--ry', 0); }); }

/* ═════════ COTIZACIÓN ═════════ */
let cart = store.get('gd_quote', []); if (!Array.isArray(cart)) cart = [];
const opts = Object.assign({ entrega: 'Recoger en tienda', pago: 'Efectivo', factura: false, nombre: '', ciudad: '', direccion: '' }, store.get('gd_opts', {}));
const has = id => cart.some(i => i.id === id);
function save() {
  store.set('gd_quote', cart);
  const c = $('[data-count]'); if (c.textContent !== String(cart.length)) { c.textContent = cart.length; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
  $$('[data-add]').forEach(b => { const on = has(b.dataset.add); b.setAttribute('aria-pressed', on); const s = $('[data-state]', b); if (s) s.textContent = on ? (s.dataset.on || 'En tu cotización') : s.dataset.off; });
  renderQuote();
}
function toggle(id, kind, title) { if (has(id)) { cart = cart.filter(i => i.id !== id); toast(title + ' salió de tu cotización'); } else { cart.push({ id, kind, t: title, note: '' }); toast(title + ' está en tu cotización'); } save(); }
function addPC(title, b, extra = []) {
  const p = sel(b), lines = Object.keys(PARTS).filter(k => p[k]).map(k => `${PARTS[k].n}: ${p[k].n}`);
  cart.push({ id: 'pc-' + Date.now(), kind: 'pc', t: title, lines: [...lines, `Luces: ${light}`, ...extra], note: '' }); save(); openQuote();
}
$('#addGuided').addEventListener('click', () => { const t = tier(); addPC(t.n, t.p, [`Uso: ${g.uses.map(u => USES.find(x => x[0] === u)[1]).join(' / ') || 'Por definir'}`, `Resolución: ${RES.find(r => r[0] === g.res)[1]}`, `Presupuesto: ${money(g.budget)}${g.budget >= 80000 ? ' o más' : ''}`]); });
$('#addBuild').addEventListener('click', () => {
  if (!Object.keys(build).length) { toast('Escoge al menos una pieza'); $('details', slots).open = true; return; }
  const c = check(build); addPC('PC a mi medida', build, [$('#wantBuild').checked ? 'La quiero armada' : 'Solo las piezas, sin armar', ...c.w.map(x => 'Revisar: ' + x)]);
});

$('#wall').innerHTML = CATS.map(c => `<button type="button" class="tile ${c.c || ''}" data-add="cat-${c.id}" data-t="${c.n}" aria-pressed="false">${c.s}<span>${c.n}<small data-state data-off="${c.h}">${c.h}</small></span></button>`).join('');
$('#services').innerHTML = SERVICES.map((s, i) => `<li data-rise style="--d:${i}"><button type="button" data-add="srv-${s.id}" data-t="${s.n}" aria-pressed="false"><div><h3>${s.n}</h3><p>${s.d}</p></div><span data-state data-off="Agregar" data-on="Agregado">Agregar</span></button></li>`).join('');
document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) toggle(b.dataset.add, b.dataset.add.slice(0, 3), b.dataset.t); });

function message() {
  const L = ['Hola Game District, quiero cotizar:', ''];
  for (const i of cart) { L.push(`*${i.kind === 'srv' ? 'Servicio: ' : ''}${i.t}*`); (i.lines || []).forEach(x => L.push('- ' + x)); if (i.note?.trim()) L.push(`- ${i.kind === 'srv' ? 'Detalle' : 'Marca, modelo o detalle'}: ${i.note.trim()}`); L.push(''); }
  L.push(`Entrega: ${opts.entrega}`); if (opts.entrega !== 'Recoger en tienda' && opts.direccion.trim()) L.push(`Dirección: ${opts.direccion.trim()}`);
  L.push(`Pago: ${opts.pago}`); if (opts.factura) L.push('Necesito factura (CFDI)');
  if (opts.nombre.trim()) L.push(`Nombre: ${opts.nombre.trim()}`); if (opts.ciudad.trim()) L.push(`Ciudad: ${opts.ciudad.trim()}`);
  return L.join('\n');
}
const refreshLink = () => { $('#sendQuote').href = waLink(message()); };
function renderQuote() {
  const box = $('#quoteItems'), none = !cart.length;
  $('#quoteOpts').hidden = none; $('.quote__foot').hidden = none;
  box.innerHTML = none ? `<div class="empty"><svg viewBox="405 118 292 294" aria-hidden="true"><use href="#cat"/></svg><h3>Aún no hay nada aquí</h3><p>Arma tu PC o escoge las piezas y servicios que quieres cotizar.</p><div class="row"><a class="btn" href="#cotiza" data-close-quote>Arma tu PC</a></div></div>` :
    cart.map(i => `<article class="qi"><div class="qi__top"><h3>${esc(i.t)}</h3><button class="qi__rm" type="button" data-rm="${esc(i.id)}" aria-label="Quitar ${esc(i.t)}">Quitar</button></div>${i.lines ? `<ul>${i.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}<input data-note="${esc(i.id)}" maxlength="140" aria-label="Detalles de ${esc(i.t)}" placeholder="${i.kind === 'srv' ? '¿Qué le pasa a tu equipo?' : i.kind === 'pc' ? '¿Algo que debamos saber?' : 'Marca o modelo que buscas'}" value="${esc(i.note || '')}"></article>`).join('');
  refreshLink();
}
const dlg = $('#quote');
function openQuote() { renderQuote(); $('#toast').classList.remove('on'); if (!dlg.open) dlg.showModal(); document.documentElement.style.overflow = 'hidden'; }
dlg.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
document.addEventListener('click', e => {
  if (e.target.closest('[data-open-quote]')) openQuote();
  if (e.target.closest('[data-close-quote]') || e.target === dlg) dlg.close();
  const rm = e.target.closest('[data-rm]'); if (rm) { cart = cart.filter(i => i.id !== rm.dataset.rm); save(); }
});
dlg.addEventListener('input', e => {
  if (e.target.dataset.note) { const i = cart.find(x => x.id === e.target.dataset.note); if (i) i.note = e.target.value; store.set('gd_quote', cart); }
  else if (e.target.name) { opts[e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; store.set('gd_opts', opts); $('#dirField').hidden = opts.entrega === 'Recoger en tienda'; }
  refreshLink();
});
$('#quoteForm').addEventListener('submit', e => e.preventDefault());
for (const el of $('#quoteForm').elements) if (el.name in opts) { if (el.type === 'radio') el.checked = opts[el.name] === el.value; else if (el.type === 'checkbox') el.checked = !!opts[el.name]; else el.value = opts[el.name]; }
$('#dirField').hidden = opts.entrega === 'Recoger en tienda';

/* ═════════ RESEÑAS: cinta infinita de derecha a izquierda, nunca se detiene ═════════ */
(() => {
  const star = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.500 15.200 8.600 23 9.500 17.200 14.800 18.800 22.500 12 18.600 5.200 22.500 6.800 14.800 1 9.500 8.800 8.600z"/></svg>'.repeat(5);
  const card = (r, hide) => `<figure class="rsn"${hide ? ' aria-hidden="true"' : ''}><div class="rsn__s" role="img" aria-label="5 de 5 estrellas">${star}</div><blockquote>${r.t}</blockquote><figcaption><svg viewBox="405 118 292 294" aria-hidden="true"><use href="#cat"/></svg><span><b>${r.n}</b>${r.d}</span></figcaption></figure>`;
  const half = Math.ceil(RESENAS.length / 2), rows = [RESENAS.slice(0, half), RESENAS.slice(half)];
  $('#cinta').innerHTML = rows.map((r, i) => `<div class="cinta__fila cinta__fila--${i + 1}">${[0, 1, 2, 3].map(c => r.map(x => card(x, c)).join('')).join('')}</div>`).join('');
  $('#resNota').hidden = !RESENAS_DEMO;
})();

/* ═════════ HORARIO: hora de Cancún ═════════ */
(() => {
  const HORAS = { 0: null, 1: [10, 19], 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19], 6: [11, 15] };
  const upd = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Cancun', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), h = +p.hour + p.minute / 60, r = HORAS[d], on = !!r && h >= r[0] && h < r[1];
    const el = $('#horNow'); el.textContent = on ? 'Abierto ahora' : 'Cerrado ahora'; el.classList.toggle('on', on);
    $$('#horario tr').forEach(t => t.classList.toggle('hoy', +t.dataset.d === (d > 0 && d < 6 ? 1 : d)));
  };
  upd(); setInterval(upd, 60000);
})();

/* ═════════ SCROLL ═════════ */
const nav = $('#nav'), sc = $('#scooter');
let tick = false;
function onScroll() {
  tick = false; nav.classList.toggle('is-solid', scrollY > 60);
  if (!still) { const r = sc.getBoundingClientRect(); const p = (innerHeight - r.top) / (innerHeight * .62); sc.style.setProperty('--sp', Math.max(0, Math.min(1, p)).toFixed(3)); }
}
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.sec-head,.ubi__info').forEach(h => $$('[data-rise]', h).forEach((x, i) => x.style.setProperty('--d', i)));
$$('[data-rise]').forEach(x => io.observe(x));

$$('#menu a').forEach(a => a.addEventListener('click', () => $('#menu').hidePopover?.()));

/* Invitación breve del botón de WhatsApp */
const wa = $('#wa'); setTimeout(() => { if (scrollY > innerHeight * .4 || innerWidth > 1020) return; wa.classList.add('hint'); addEventListener('scroll', () => wa.classList.remove('hint'), { once: true, passive: true }); setTimeout(() => wa.classList.remove('hint'), 4200); }, still ? 800 : 5200);

renderBuild(); renderGuided(); save(); onScroll();
})();
