import swaggerUserSchema from "../../model/user/index.js"
import swaggerDogSchema from "../../model/dog/index.js"

const definition = {
  openapi: "3.0.2",
  info: {
    title: "Test API Reference",
    description: "test",
    contact: {
      name: "TEST API",
    },
  },
  servers: [
    {
      url: "http://localhost:5200",
      description: "Localhost",
    },
    {
      url: "coming soon",
      description: "Production Server",
    },
    {
      url: "coming soon",
      description: "Development Server",
    },
  ],
  components: {
    // securitySchemes: {
    //   BearerAuth: {
    //     type: "http",
    //     scheme: "Bearer",
    //     bearerFormat: "JWT",
    //   },
    // },
    schemas: {
      "User": swaggerUserSchema,
      "Dog": swaggerDogSchema,
    },
  },
};

const options = {
  definition,
  apis: [
    "./api/routes/auth/login.js",
    "./api/routes/user/index.js",
    "./api/routes/dog/index.js",
    "./api/routes/images/index.js",
  ],
};

export default options;
