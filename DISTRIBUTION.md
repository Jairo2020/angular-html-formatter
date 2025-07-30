# 📦 Guía de Distribución - Angular HTML Formatter

## 🏗️ **Arquitectura Refactorizada**

### **Estructura Modular del Proyecto:**
```
src/
├── extension.ts         # Punto de entrada principal
├── types.ts            # Definiciones de tipos TypeScript
├── indentation.ts      # Detector de configuración de indentación
├── tokenizer.ts        # Tokenizador de Angular HTML
├── block-analyzer.ts   # Analizador de bloques Angular/HTML
├── formatter.ts        # Formateador principal
└── test/              # Pruebas unitarias
```

### **Ventajas de la Refactorización:**
- ✅ **Separación de responsabilidades**
- ✅ **Fácil mantenimiento y testing**
- ✅ **Extensibilidad para nuevas características**
- ✅ **Código reutilizable y limpio**
- ✅ **Tipado fuerte con TypeScript**

---

## 🚀 **Pasos para Distribuir la Extensión**

### **1. Preparación para Publicación**

#### **Instalar vsce (Visual Studio Code Extension manager):**
```bash
npm install -g @vscode/vsce
```

#### **Verificar que todo esté compilado:**
```bash
npm run compile
```

#### **Ejecutar tests (opcional):**
```bash
npm test
```

### **2. Configuración del Publisher**

#### **Crear cuenta en Azure DevOps:**
1. Ve a [Azure DevOps](https://dev.azure.com)
2. Crea una cuenta gratuita
3. Crea una organización
4. Ve a User Settings > Personal Access Tokens
5. Crea un token con permisos de "Marketplace (manage)"

#### **Configurar vsce con tu token:**
```bash
vsce login tu-nombre-publisher
# Ingresa tu Personal Access Token cuando se solicite
```

### **3. Actualizar package.json**

**Ya configurado en tu archivo, pero asegúrate de cambiar:**
```json
{
  "publisher": "tu-nombre-real",  // ⚠️ Cambia esto
  "author": {
    "name": "Tu Nombre Real",     // ⚠️ Cambia esto
    "email": "tu-email@real.com"  // ⚠️ Cambia esto
  },
  "repository": {
    "url": "https://github.com/tu-usuario/angular20-html-formatter.git"  // ⚠️ Cambia esto
  }
}
```

### **4. Crear el Package**

```bash
# Crear el archivo .vsix (paquete de la extensión)
vsce package

# Esto generará: angular20-html-formatter-1.0.0.vsix
```

### **5. Opciones de Distribución**

#### **Opción A: Publicar en VS Code Marketplace (Recomendado)**
```bash
# Publicar directamente
vsce publish

# O publicar un archivo específico
vsce publish angular20-html-formatter-1.0.0.vsix
```

#### **Opción B: Distribución Manual**
```bash
# Instalar localmente para pruebas
code --install-extension angular20-html-formatter-1.0.0.vsix

# Compartir el archivo .vsix directamente
# Los usuarios pueden instalarlo con:
# code --install-extension archivo.vsix
```

#### **Opción C: GitHub Releases**
1. Sube el código a GitHub
2. Crea un release con el archivo `.vsix`
3. Los usuarios pueden descargar e instalar manualmente

---

## 🔧 **Comandos de Desarrollo**

### **Para desarrollo continuo:**
```bash
# Modo watch (recompila automáticamente)
npm run watch

# Abrir VS Code con extensión en desarrollo
code --extensionDevelopmentPath=.

# O presionar F5 en VS Code
```

### **Para actualizar la extensión:**
```bash
# 1. Actualizar version en package.json
# 2. Actualizar CHANGELOG.md
# 3. Compilar
npm run compile

# 4. Crear nuevo package
vsce package

# 5. Publicar actualización
vsce publish
```

---

## 📋 **Checklist Pre-Publicación**

- [ ] ✅ Código compilado sin errores
- [ ] ✅ Tests pasando
- [ ] ✅ README.md actualizado
- [ ] ✅ CHANGELOG.md actualizado
- [ ] ✅ package.json con información correcta
- [ ] ✅ Licencia incluida (MIT)
- [ ] ✅ Publisher configurado
- [ ] ✅ Extensión probada localmente
- [ ] ✅ Icono agregado (opcional)

---

## 🎯 **URLs Importantes**

- **VS Code Marketplace:** https://marketplace.visualstudio.com/
- **Publishing Guide:** https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **vsce Documentation:** https://github.com/microsoft/vscode-vsce
- **Azure DevOps:** https://dev.azure.com

---

## 🐛 **Resolución de Problemas Comunes**

### **Error: "Publisher not found"**
```bash
# Verificar publishers disponibles
vsce ls-publishers

# Crear nuevo publisher si es necesario
vsce create-publisher
```

### **Error de compilación:**
```bash
# Limpiar y recompilar
rm -rf out/
npm run compile
```

### **Error de permisos:**
```bash
# Verificar token de acceso
vsce logout
vsce login tu-publisher
```

---

¡Tu extensión está lista para ser distribuida! 🎉
