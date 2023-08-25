const express = require("express");
const connectDB = require("./db");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 8889;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
  });
