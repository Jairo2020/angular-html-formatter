# Changelog

## [1.0.0] - 2025-07-30

### 🎉 Lanzamiento Inicial

Bienvenido a **Angular HTML Formatter** - La extensión de VS Code más completa para formatear templates HTML de Angular con soporte total para la nueva sintaxis de Angular 17+.

### ✨ Características Principales

#### 🚀 Sintaxis Angular 17+ Completa
- ✅ **Bloques de control:** `@if () {}`, `@else`, `@else if`
- ✅ **Loops:** `@for () {}`, `@empty`  
- ✅ **Switch:** `@switch () {}`, `@case`, `@default`
- ✅ **Defer:** `@defer {}`, `@loading`, `@error`, `@placeholder`
- ✅ **Interpolaciones:** `{{ variable }}`, `{{ expression | pipe }}`

#### 🎯 Formateo Inteligente
- **Elementos cortos en línea:** Mantiene elementos pequeños en una sola línea automáticamente
- **Preservación de contenido:** Respeta exactamente el contenido de texto sin agregar espacios innecesarios
- **Respeto a decisiones del usuario:** Si formateas un elemento en múltiples líneas, se respeta tu decisión
- **Detección automática:** Identifica cuándo un elemento debe mantenerse compacto o expandido

#### 🔧 Configuración Avanzada
- **Indentación inteligente:** Detección automática de configuración VS Code (espacios/tabs)
- **Tamaño dinámico:** Respeta `editor.tabSize` y `editor.insertSpaces`
- **Configuración por archivo:** Soporte para configuraciones específicas de HTML
- **8 opciones configurables:** Control total sobre el comportamiento del formateo

#### 🎨 Formateo de Interpolaciones
- **Operadores inteligentes:** Formatea automáticamente `+`, `-`, `*`, `/`, `&&`, `||`, `===`, etc.
- **Pipes espaciados:** `{{ user.name|uppercase }}` → `{{ user.name | uppercase }}`
- **Contexto de comillas:** Preserva operadores dentro de strings de atributos
- **Escape respetado:** Maneja correctamente comillas escapadas `\"` y `\'`

### 📋 Ejemplos de Formateo

#### Control Flow de Angular
```html
<!-- Antes -->
<div>
@if (user.isLoggedIn) {
<h1>Bienvenido {{ user.name }}</h1>
@if (user.hasPermissions) {
<nav><a href="/admin">Admin</a></nav>
}
} @else {
<p>Por favor inicia sesión</p>
}
</div>

<!-- Después -->
<div>
  @if (user.isLoggedIn) {
    <h1>Bienvenido {{ user.name }}</h1>
    @if (user.hasPermissions) {
      <nav>
        <a href="/admin">Admin</a>
      </nav>
    }
  } @else {
    <p>Por favor inicia sesión</p>
  }
</div>
```

#### Elementos Inline Inteligentes
```html
<!-- Antes -->
<div class="small">
  Hello World
</div>
<button 
  type="button" 
  class="btn">
  Click me
</button>

<!-- Después -->
<div class="small">Hello World</div>
<button type="button" class="btn">Click me</button>
```

#### Operadores en Interpolaciones
```html
<!-- Atributos HTML (NO se formatean) -->
<div title="value > 100 && status < 5">Content</div>

<!-- Interpolaciones Angular (SÍ se formatean) -->
<p>{{ value>100&&status<5 }}</p>
<!-- Resultado: -->
<p>{{ value > 100 && status < 5 }}</p>
```

### 🛠️ Características Técnicas

#### Arquitectura Modular
- **Tokenizador inteligente:** Procesamiento optimizado de HTML + Angular
- **Análisis de bloques:** Detección y formateo de bloques de control anidados
- **Sistema de operadores:** Formateo modular de operadores con contexto de comillas
- **Validación HTML:** Preservación de sintaxis HTML válida en todo momento

#### Integración VS Code
- **Comandos personalizados:** `Angular: Format HTML Document/Selection`
- **Atajos de teclado:** `Ctrl+Shift+Alt+F` para archivos HTML
- **Formateo estándar:** Integración con `Alt+Shift+F`
- **Configuración automática:** Respeta configuración de indentación del editor

#### Configuraciones Disponibles
```json
{
  "angular-html-formatter.enable": true,
  "angular-html-formatter.indentSize": 2,
  "angular-html-formatter.maxLineLength": 100,
  "angular-html-formatter.inlineShortElements": true,
  "angular-html-formatter.shortElementThreshold": 200,
  "angular-html-formatter.preserveUserMultiline": true,
  "angular-html-formatter.formatOnSave": false,
  "angular-html-formatter.preserveNewLines": true
}
```

### 🎯 Casos de Uso Soportados

- ✅ **Templates de componentes Angular:** Formateo completo de archivos .html
- ✅ **Bloques de control anidados:** @if, @for, @switch con múltiples niveles
- ✅ **Interpolaciones complejas:** Expresiones con operadores, pipes y funciones
- ✅ **Atributos HTML:** Preservación exacta de valores con operadores
- ✅ **Contenido mixto:** HTML + Angular + texto en el mismo template
- ✅ **Comentarios:** Preservación de comentarios HTML y Angular

### 🚀 Instalación

#### Desde VS Code Marketplace
1. Abre VS Code
2. Ve a Extensiones (`Ctrl+Shift+X`)
3. Busca "Angular HTML Formatter"
4. Haz clic en "Install"

#### Instalación Manual
```bash
code --install-extension angular-html-formatter-1.0.0.vsix
```

### 📋 Requisitos del Sistema

- **VS Code:** 1.102.0 o superior
- **Archivos soportados:** `.html` (templates de Angular)
- **Compatibilidad:** Angular 17, 18, 19, 20+

### 🐛 Reportar Issues

¿Encontraste un problema? [Abre un issue](https://github.com/Jairo2020/angular20-html-formatter/issues) con:

- 📝 Descripción detallada del problema
- 🔧 Código de ejemplo que causa el issue
- 💻 Versión de VS Code y del sistema operativo
- 📋 Pasos para reproducir el problema

### 🙏 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Abre un Pull Request

### 📄 Licencia

MIT License - Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

**¡Gracias por usar Angular HTML Formatter!** 

Desarrollado con ❤️ para la comunidad Angular 🅰️

**Autor:** Jairo Rohatan  
**Email:** soporterohatan@gmail.com  
**GitHub:** [Jairo2020/angular20-html-formatter](https://github.com/Jairo2020/angular20-html-formatter)
