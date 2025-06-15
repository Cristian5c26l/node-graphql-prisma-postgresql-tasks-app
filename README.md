# Arquitectura de software del proyecto

![Arquitectura limpia](./docs/resumen-de-arquitectura-de-la-aplicacion.png)

# Instalación y Ejecución

## Desarrollo (Local)

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

9. Acceder a la aplicación en tu navegador:
   - GraphQL Playground: [http://localhost:4000](http://localhost:4000)

10. Para probar las operaciones de GraphQL, puedes usar el siguiente ejemplo de consulta:
   ```graphql
   query($userId: ID!) {
      allTasks(userId: $userId) {
         title
         columnId
         userId
      }
   }
   ```

   con variables:
   
   ```json
   {
      "userId": "userIdValue"
   }
   ```

## Producción (Deploy)

1. Ir al sitio de despliegue render.com (https://dashboard.render.com/)
2. Desplegar el proyecto desde este repositorio de GitHub llamado "node-graphql-prisma-postgresql-tasks-app" como Web Service.
3. Autorizar el acceso de Render al repositorio de GitHub y seguir con las instrucciones para confirmar el acceso.
4. Campos de configuración del deployment

   - **Source Code**: `NombreUsuarioGithub/node-graphql-prisma-postgresql-tasks-app` en este caso.
   - **Name**: Nombre del servicio (por ejemplo, el mismo `node-graphql-prisma-postgresql-tasks-app`)
   - **Language**: Lenguaje del proyecto (`Node` en este caso)
   - **Branch**: Rama de GitHub a desplegar (`main` en este caso)
   - **Region**: Región de despliegue (`Oregon` en este caso)
   - **Root Directory**: Directorio raíz del proyecto (dejar vacío este campo en este caso ya que todo el proyecto está en la raíz del repositorio la cual contiene el archivo `package.json`)
   - **Build Command**: Comando para construir el proyecto (`npm install` en este caso)
   - **Start Command**: Comando para iniciar el servidor (`npm start` en este caso. Este script realiza `rimraf ./dist && tsc && prisma migrate deploy && node dist/app.js`, es decir, primero elimina la carpeta `dist`, luego compila el proyecto TypeScript a JavaScript, aplica las migraciones de Prisma y finalmente inicia el servidor con el archivo `app.js` generado en la carpeta `dist` durante la ejecución de `tsc`).
   - Instance Type: Tipo de instancia (`Free` en este caso, o el preferido)
   - **Environment Variables**: 
     - `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL remota (por ejemplo, la cadena de conexión **de producción similar a** `postgresql://user:password@localhost:5432/database` pero con los datos de tu base de datos en producción alojada en un servidor externo).
 
5. Hacer clic en el botón "Deploy Web Service" para iniciar el despliegue de esta aplicación de node en este repositorio como un servicio web disponible a través de Internet.
