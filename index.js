const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db.config");
const errorMiddleware = require("./middleware/error.middleware");

const AuthRouter = require("./router/auth.routes");
const UserRouter = require("./router/user.routes");
const CotegoryRouter = require("./router/cotegory.routes");
const MadelRouter = require("./router/madel.routes");
const SevedRouter = require("./router/saved.routes");
const uploadRouter = require("./router/upload.routes");
const { SuperAdminRouter } = require("./router/superadmin.routes");
const { AdminPanelRouter } = require("./router/adminPanel.routes");

const app = express();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/images", express.static("uploads"));

app.use(AuthRouter);
app.use(UserRouter);
app.use(CotegoryRouter);
app.use(MadelRouter);
app.use(SevedRouter);
app.use(uploadRouter);
app.use(SuperAdminRouter);
app.use(AdminPanelRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server ishladi" + (process.env.PORT || 3000));
});
