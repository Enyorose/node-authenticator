import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

//esm specific code
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: __dirname + '/.env' });