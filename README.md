

# Instalación

## Desarrollo

1. Clona el repositorio:
   ```bash
   git clone
    ```
2. Navega al directorio del proyecto:
   ```bash
   cd nombre-del-repositorio
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Tener disponible un archivo `.env` con las variables de entorno necesarias. Un ejemplo de este archivo podría ser:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/database"
   ```

5. Levantar la base de datos con Docker:
   ```bash
   docker compose up -d
   ```
    Asegúrate de que Docker esté instalado y en ejecución.

6. Aplicar migraciones:
   ```bash
   npx prisma migrate dev --name init
   ```

7. Generar el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

8. Iniciar el servidor de desarrollo:
   ```bash
    npm run dev
    ```

## Producción