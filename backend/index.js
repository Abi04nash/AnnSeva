import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import donorRoute from "./routes/donor.route.js";
import donationRoute from "./routes/donation.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";
import { handleDonationExpiry } from "./utils/donationExpiry.js";



dotenv.config({});

const app = express();

const _dirname = path.resolve();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'https://annseva-edbw.onrender.com',
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/donor", donorRoute);
app.use("/api/v1/donation", donationRoute);
app.use("/api/v1/application", applicationRoute);


app.use(express.static(path.join(_dirname , "/frontend/dist")));
app.get('*',(_, res) => {
  res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
});



// Yahh se update for the server
const startServer = async () => {
  try {
    await connectDB();                 // This = DB connect
    await handleDonationExpiry();      // This = Expiry logic run once

    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`);
    });
  } catch (error) {
    console.log("Server start failed ❌", error);
  }
};


startServer();