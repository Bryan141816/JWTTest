import "dotenv/config";

import app from "./app.js";
import { testDatabaseConnection } from "./config/testConnection.js";

const PORT = process.env.PORT || 5000;

// await testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});