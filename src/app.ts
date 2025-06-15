import { seed } from "./data/seed";
import { ServerApp } from "./presentation/server-app";


(async() => {
    main();
})();


async function main() {
    // 1. Poblar base de datos

    seed();
    
    // 2. Solucion del ejercicion
    
    ServerApp.run({welComeMessage: `Bienvenido a la aplicación llamada "Tareas por Hacer"`});// Send Object

}