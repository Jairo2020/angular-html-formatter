# Angular HTML Formatter

🚀 **Extensión VS Code para formatear código HTML de Angular con soporte completo para la nueva sintaxis de control flow de Angular 17+**

## ✨ Características Principales

- ✅ **Sintaxis Angular 17+ completa:**
  - `@if (){}`, `@else`, `@else if`
  - `@for (){}`, `@empty`  
  - `@switch (){}`, `@case`, `@default`
  - `@defer {}`, `@loading`, `@error`, `@placeholder`

- ✅ **Indentación inteligente:**
  - Detección automática de configuración VS Code
  - Soporte para espacios y tabs
  - Respeta `editor.tabSize` y `editor.insertSpaces`

- ✅ **Formateo avanzado:**
  - Preserva comentarios y contenido HTML
  - Manejo inteligente de bloques anidados
  - Formateo de documentos completos y selecciones
  - Arquitectura modular y extensible

## 🚀 Uso Rápido

| Acción | Windows/Linux | Mac |
|--------|---------------|-----|
| **Formatear documento** | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| **Formatear selección** | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| **Comando manual** | `Ctrl+Shift+P` > "Format Angular HTML" | `Cmd+Shift+P` > "Format Angular HTML" |

## 📝 Ejemplos de Formateo

### ➡️ Transformación Automática:

**Antes:**
```html
<div>
@if (user.isLoggedIn) {
<h1>Bienvenido {{ user.name }}</h1>
@if (user.hasPermissions) {
<nav><a href="/admin">Admin</a></nav>
}
} @else {
<p>Por favor inicia sesión</p>
}
@for (item of items; track item.id) {
<div class="item">{{ item.name }}</div>
} @empty {
<p>No hay elementos</p>
}
</div>
```

**Después:**
```html
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
  @for (item of items; track item.id) {
    <div class="item">{{ item.name }}</div>
  } @empty {
    <p>No hay elementos</p>
  }
</div>
```

## ⚙️ Configuración Automática

La extensión se integra perfectamente con tu configuración de VS Code:

```json
{
  "editor.insertSpaces": true,     // Usa espacios (default)
  "editor.tabSize": 2,            // 2 espacios por nivel
  "editor.detectIndentation": true // Detección automática
}
```

## 🏗️ Arquitectura Modular

La extensión está construida con una arquitectura limpia y escalable:

```
src/
├── extension.ts         # Punto de entrada VS Code
├── types.ts            # Definiciones TypeScript
├── indentation.ts      # Detector de configuración
├── tokenizer.ts        # Analizador Angular/HTML
├── block-analyzer.ts   # Detector de bloques
└── formatter.ts        # Lógica de formateo
```

## 📦 Instalación

### Desde VS Code Marketplace:
1. Abre VS Code
2. Ve a Extensiones (`Ctrl+Shift+X`)
3. Busca "Angular HTML Formatter"
4. Haz clic en "Install"

### Instalación Manual:
```bash
code --install-extension angular20-html-formatter-1.0.0.vsix
```

## 🔧 Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/angular20-html-formatter.git

# Instalar dependencias
npm install

# Compilar
npm run compile

# Modo desarrollo
npm run watch

# Ejecutar tests
npm test
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📋 Requisitos

- Visual Studio Code 1.74.0 o superior
- Node.js 16+ (para desarrollo)

## 📄 Licencia

MIT License - ve [LICENSE](LICENSE) para más detalles.

## 🐛 Reportar Issues

¿Encontraste un bug? [Abre un issue](https://github.com/tu-usuario/angular20-html-formatter/issues) con:
- Descripción del problema
- Código de ejemplo
- Versión de VS Code
- Steps para reproducir

---

**¡Hecho con ❤️ para la comunidad Angular!** 🅰️
      <div class="item">{{item.name}}</div>
    }
  </div>
} @else {
  <div class="login">Inicia sesión</div>
}
```

## Instalación para Desarrollo

1. Clona este repositorio
2. Ejecuta `npm install`
3. Abre el proyecto en VS Code
4. Presiona `F5` para abrir una nueva ventana de VS Code con la extensión cargada
5. Abre un archivo HTML con sintaxis de Angular y prueba el formateo

## Configuración

La extensión respeta automáticamente la configuración de indentación de VS Code:

### Configuración Automática ✨
- **Detección automática**: La extensión detecta si el archivo usa espacios o tabs
- **Tamaño dinámico**: Respeta el `tabSize` configurado en VS Code
- **Por tipo de archivo**: Puede usar configuraciones específicas para HTML

### Configuraciones de VS Code que se respetan:
```json
{
  "editor.insertSpaces": true,     // true = espacios, false = tabs
  "editor.tabSize": 2,             // Tamaño de indentación (2, 4, 8, etc.)
  "editor.detectIndentation": true, // Detectar automáticamente del archivo
  "[html]": {
    "editor.tabSize": 2,           // Configuración específica para HTML
    "editor.insertSpaces": true
  }
}
```

### Ejemplos de configuración:

**Para proyectos con 2 espacios:**
```json
{
  "[html]": {
    "editor.tabSize": 2,
    "editor.insertSpaces": true
  }
}
```

**Para proyectos con tabs:**
```json
{
  "[html]": {
    "editor.insertSpaces": false
  }
}
```

**Para proyectos con 4 espacios:**
```json
{
  "[html]": {
    "editor.tabSize": 4,
    "editor.insertSpaces": true
  }
}
```

## Contribuir

Si encuentras algún problema o tienes sugerencias de mejora, por favor:
1. Abre un issue describiendo el problema
2. Incluye ejemplos de código que no se formatean correctamente
3. Especifica la versión de Angular que estás usando

## Licencia

MIT
