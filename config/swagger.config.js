import swaggerUi from "swagger-ui-express";
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust the path based on the actual file location
const swaggerPath = path.join(__dirname, '../docs', 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
