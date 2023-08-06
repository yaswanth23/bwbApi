const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      description:
        'The bwb-v1 backend repository serves as the core engine of our application, powering its functionality and delivering seamless user experiences.',
      version: '1.0.0',
      title: 'BWB-V1',
    },
    host: 'localhost:9100',
    basePath: '',
    servers: [
      {
        url: 'http://localhost:9100/api',
        description: 'url to connect at localhost',
      },
    ],
    schemes: ['http', 'https'],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
