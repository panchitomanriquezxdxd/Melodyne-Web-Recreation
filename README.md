# Melodyne Web Recreation

Editor de tono en el navegador (JavaScript puro, sin dependencias). Funciona en PC y móvil.

## Estructura
- `index.html`: página principal.
- `css/`: estilos (incluye la adaptación a móvil).
- `js/core/`: estado global y deshacer/rehacer.
- `js/audio/`: detección de tono (YIN), reproducción y exportación WAV.
- `js/ui/`: dibujo del piano roll y edición con ratón o táctil.
- `js/io/`: entrada de audio (archivo, micrófono, ejemplo) y proyectos.
- `js/main.js`: arranque y atajos de teclado.

## Uso
Abre `index.html` con un servidor local (`python3 -m http.server`) o activa GitHub Pages.
Atajos: Espacio reproduce, Ctrl+Z deshace, Ctrl+Y o Ctrl+Shift+Z rehace, flechas ↑↓ mueven la nota seleccionada un semitono.

## Pendiente
Polifonía (DNA), pitch-shift de calidad (PSOLA o phase vocoder), formantes, vibrato, edición del tiempo, separar y unir notas.
