// swaggerConfig.js
import swaggerUi from "swagger-ui-express";
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./Docs/swagger.yaml');

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

};

export default setupSwagger;