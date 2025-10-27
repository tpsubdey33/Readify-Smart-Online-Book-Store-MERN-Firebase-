// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Readify Book Store API",
      version: "1.0.0",
      description: "Swagger documentation for Readify MERN Bookstore Backend",
      contact: {
        name: "Subrata Dey",
        url: "https://www.linkedin.com/in/subrata-dey-5b9820274",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.js"], // 👈 Swagger will scan all route files inside /src
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs available at http://localhost:5000/api-docs");
}

module.exports = { swaggerDocs };
