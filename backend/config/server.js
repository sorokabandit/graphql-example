const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../config/schema");
const root = require("../src/routes/routes");
const authMiddleware = require("../src/middlewares/check-token");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Применяем authMiddleware, пропуская публичные мутации
app.use((req, res, next) => {
  if (req.path === "/graphql" && req.method === "POST") {
    const body = req.body;
    if (body && body.query && (body.query.includes("register") || body.query.includes("login"))) {
      console.log("Skipping authMiddleware for public mutations (register/login)");
      return next();
    }
  }
  authMiddleware(req, res, next);
});

app.use(
  "/graphql",
  graphqlHTTP((req) => {
    console.log("graphqlHTTP: req", { headers: req.headers, user: req.user });
    return {
      schema,
      rootValue: root,
      context: { user: req.user || null },
      graphiql: true,
    };
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});