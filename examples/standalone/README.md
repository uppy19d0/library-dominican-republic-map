# Standalone HTML demo

Demo interactivo **sin React ni Vite**.

## Cómo abrirlo

```bash
# desde la raíz del repo
npm run demo
```

O con cualquier servidor estático:

```bash
npx serve examples/standalone
python3 -m http.server 4173 --directory examples/standalone
```

Luego abre `http://localhost:4173`.

## Qué incluye

- 32 provincias clickeables
- Tooltip al hover
- Selección múltiple
- Zoom con rueda / pellizco
- Pan al arrastrar
- Controles + / − / reset

Si quieres el example React, usa `examples/basic` con `npm run example`.
