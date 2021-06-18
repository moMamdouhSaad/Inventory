const db = {
  driver: "msnodesqlv8",
  server: "localhost",
  database: "Inventory",
  options: {
    trustedConnection: true,
    useUTC: true,
  },
};

export default db;

/*

server: "localhost",
  database: "Inventory",
  user: "inv123",
  password: "123",
  port: 1464,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustedConnection: true,
  },

*/
