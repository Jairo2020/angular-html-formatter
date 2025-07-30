# Changelog

## [1.0.0] - 2025-07-30

### Agregado
- ✅ Soporte completo para la nueva sintaxis de Angular 17+ con bloques de control
- ✅ Formateo de `@if`, `@else`, `@for`, `@switch`, `@case`, `@default`
- ✅ Soporte para `@defer`, `@loading`, `@error`, `@placeholder`
- ✅ Detección automática de configuración de indentación de VS Code
- ✅ Soporte para espacios y tabs
- ✅ Detección del tamaño de indentación (2, 4, 6, 8 espacios)
- ✅ Integración completa con VS Code formatter
- ✅ Comandos personalizados de formateo
- ✅ Arquitectura modular y escalable

### Características Técnicas
- Tokenizador inteligente para Angular HTML
- Análisis de bloques de control anidados
- Detección automática de configuración del editor
- Preservación de contenido HTML y texto
- Formateo de selección y documento completo

### Comandos Disponibles
- `Angular: Format HTML Document` - Formatear documento completo
- `Angular: Format HTML Selection` - Formatear selección
- Atajo de teclado: `Ctrl+Shift+Alt+F` para archivos HTML
- Integración con `Alt+Shift+F` (formato estándar de VS Code)