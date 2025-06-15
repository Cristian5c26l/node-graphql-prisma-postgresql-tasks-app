// import { CreateTable } from "../domain/use-cases/create-table.use-case";
// import { SaveFile } from "../domain/use-cases/save-file.use-case";

import { ApolloServer } from "apollo-server";

import { resolvers, typeDefs } from "../graphql";

interface RunOptions {
  welComeMessage?: string;
}

export class ServerApp {
  // static run(options: RunOptions) {
  static run({
    welComeMessage = 'Bienvenido a la aplicación llamada "Tareas por Hacer"',
  }: RunOptions) {
    // Desestructuración de opciones

    console.log(`\n\n${welComeMessage}`);

    const server = new ApolloServer({
      typeDefs: typeDefs,
      resolvers: resolvers,
    });

    //   server.listen().then(({ url }) => {
    //   console.log(`Servidor corriendo en ${url}`);
    // });
      
      const PORT = process.env.PORT || 4000;
    server.listen({
      port: PORT, cors: {
        origin: '*',// Permitir todas las solicitudes que vengan de sitios externos como netlify
        credentials: true,
} }).then(({ url }) => {
  console.log(`Servidor Backend API Node Graphql corriendo en ${url}`);
});
      
    
  }
}
