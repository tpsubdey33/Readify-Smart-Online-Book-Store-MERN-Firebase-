const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Readify Book Store API",
      version: "1.0.0",
      description: "Comprehensive REST API for Readify MERN Bookstore Backend with full CRUD operations, user management, favorites, and order processing",
      contact: {
        name: "Subrata Dey",
        url: "https://www.linkedin.com/in/subrata-dey-5b9820274",
      },
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
      {
        url: "https://your-production-url.com/api",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <token>"
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Books",
        description: "Book management endpoints"
      },
      {
        name: "Favorites",
        description: "User favorites management"
      },
      {
        name: "Users",
        description: "User authentication and management"
      },
      {
        name: "Orders",
        description: "Order processing and management"
      },
      {
        name: "Subscribers",
        description: "Newsletter subscription management"
      },
      {
        name: "Admin",
        description: "Administrative operations"
      }
    ],
  },
  apis: ["./src/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Readify Book Store API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📘 Swagger Docs available at http://localhost:5000/api-docs");
}

module.exports = { swaggerDocs };