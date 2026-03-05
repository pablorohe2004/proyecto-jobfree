# Proyecto JobFree 
JobFree es una aplicación web para la gestión y contratación de servicios a domicilio que conecta a clientes con profesionales de distintos sectores (mantenimiento del hogar, reparaciones, cuidado personal, etc.).

La plataforma permite a los usuarios buscar, comparar y reservar servicios de forma rápida y segura, mientras que los profesionales pueden ofrecer sus servicios y gestionar su disponibilidad.

## Tecnologías utilizadas

**Frontend**
- HTML5
- CSS
- JavaScript
- React

**Backend**
- Java
- Spring Boot
- Spring Security
- Spring Data JPA

**Base de datos**
- MySQL

**Herramientas y servicios**
- Git y GitHub (control de versiones)
- Figma y Balsamiq (diseño de interfaces)
- Draw.io (diagramas UML y entidad-relación)
- Stripe (pasarela de pagos)
- Leaflet + OpenStreetMap (geolocalización)
- Render (despliegue de la aplicación)

---

## Estructura del proyecto

- **backend/** → API REST desarrollada con Spring Boot  
- **frontend/** → Aplicación web desarrollada con React  
- **database/** → Script SQL con la estructura de la base de datos 

## Requisitos
Para ejecutar el proyecto es necesario tener instalado:
- Java 17
- Maven
- Node.js
- MySQL o MariaDB

## Base de datos

La base de datos utilizada se llama: `jobfree`

Para cargar la base de datos basta con importar el archivo: `database/jobfree.sql`


## Ejecutar el backend

1. Entrar en la carpeta del backend (`cd backend`)
2. Ejecutar la aplicación (`mvn spring-boot:run`)

El servidor se iniciará en: `http://localhost:8080`

## Ejecutar el frontend

1. Entrar en la carpeta del frontend (`cd frontend`)
2. Instalar dependencias (`npm install`)
3. Iniciar la aplicación (`npm start`)

La aplicación web se abrirá en: `http://localhost:3000`

---

## Desarrollado por

- Pablo Román Heredia  
- Daniel Nevado Merino