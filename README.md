# 📦 Proyecto ANVA Next.js + Prisma + XAMPP (MySQL)

Este es un proyecto web desarrollado con **Next.js** y **Prisma ORM**, utilizando **MySQL** como base de datos local a través de **XAMPP**.

**-------------------------------------------📝Clonar el proyecto-------------------------------------------**

## 🚀 Instalación y uso

Sigue los pasos a continuación para clonar y ejecutar este proyecto correctamente:

### 1. Clona el repositorio

git clone https://github.com/WalterMartinez20/ANVA.git
cd ANVA

**-------------------------------------------📝Instalación-------------------------------------------**

### 2. Instala las dependencias

npm install

**-------------------------------------------📝Configuracion de la base de datos-------------------------------------------**

### 3. Configura el entorno

Crea un archivo `.env` en la raíz del proyecto y agrega la siguiente línea con tus datos locales:

DATABASE_URL="mysql://root:@localhost:3306/nombre_de_tu_base"

> Asegúrate de que la base de datos `nombre_de_tu_base` exista y esté corriendo en XAMPP.

### 4. Inicia MySQL desde XAMPP

- Abre XAMPP y enciende el módulo **MySQL**.
- Crea una base de datos vacía llamada `nombre_de_tu_base` (puedes hacerlo desde phpMyAdmin).

### 5. Aplica el esquema de Prisma a la base de datos

Una vez creada la base de datos, ejecuta el siguiente comando para aplicar el esquema de Prisma (crear tablas, relaciones, etc.):

npx prisma db push

### 6. Levanta el servidor de desarrollo

npm run dev

- Accede a la aplicación en: [http://localhost:3000](http://localhost:3000)

**-------------------------------------------📝Informacion adicional-------------------------------------------**

## 🧰 Scripts útiles

- `npx prisma generate` – Genera el cliente de Prisma
- `npx prisma studio` – Abre la interfaz visual de la base de datos
- `npm run dev` – Inicia el servidor en modo desarrollo

## 📁 Estructura del proyecto

`ANVA/`
`├── .next/`ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ# Archivos de compilación de Next.js
`├── app/`ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ# Archivos de configuración de Next.js
`├── components/`ㅤㅤㅤㅤㅤㅤㅤ# Componentes reutilizables de React
`├── contexts/`ㅤㅤㅤㅤㅤㅤㅤ # Contextos de React (manejo de estado global)
`├── hooks/` ㅤㅤㅤㅤㅤㅤㅤㅤㅤ# Custom hooks
`├── lib/` ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ# Funciones auxiliares o utilidades
`├── node_modules/`ㅤㅤㅤㅤㅤ# Dependencias del proyecto
`├── prisma/` ㅤㅤㅤㅤㅤㅤㅤㅤ# Archivos de configuración de Prisma
`├── public/` ㅤㅤㅤㅤㅤㅤㅤㅤ# Archivos públicos (imágenes, favicon, etc.)
`├── scripts/` ㅤㅤㅤㅤㅤㅤㅤ# Scripts auxiliares
`├── styles/` ㅤㅤㅤㅤㅤㅤㅤㅤ# Archivos de estilos (Tailwind u otros)
`├── types/` ㅤㅤㅤㅤㅤㅤㅤㅤㅤ# Tipado global (TypeScript)
`├── .env`ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ # Variables de entorno
`├── package.json` ㅤㅤㅤㅤㅤ# Configuración del proyecto y dependencias
`├── tsconfig.json` ㅤㅤㅤㅤㅤ# Configuración de TypeScript
`├── README.md` ㅤㅤㅤㅤㅤㅤㅤ# Documentación del proyecto
`└── ...`

## 📝 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

## ✨ Autor

- **Walter Martinez** – [@WalterMartinez20](https://github.com/WalterMartinez20/ANVA.git)
