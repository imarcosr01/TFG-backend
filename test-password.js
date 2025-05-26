const bcrypt = require('bcrypt');

const hashDeTuBD = '$2b$10$7rJWxi4H6TpslYjPNA5CrOQ7JEcIuChGQGlP6hME0G8.tY6JWw1mK'; // Hash de "prueba"
const passwordAPrueba = 'prueba'; // Contraseña a verificar

const match = bcrypt.compareSync(passwordAPrueba, hashDeTuBD);
console.log('¿La contraseña coincide?', match); // Debe imprimir "true"