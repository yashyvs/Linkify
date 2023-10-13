const express = require("express");
const app = express();
const URL = require("./models/url");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const urlRoute = require("./routes/url");

app.use(cors());
app.use(express.json());
app.use("/", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

const dbConnect = require("./config/database");
dbConnect();

app.listen(PORT, () => {
  console.log(`connected at port no. ${PORT}`);
});
