import { app } from './endpoints.js';
import { HTTP_IP, HTTP_PORT } from './config.js';
import { fileURLToPath } from 'url';
import * as path from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(path.dirname(__filename));

app.listen(HTTP_PORT, HTTP_IP, () => {
  console.log("server is running!");
});
