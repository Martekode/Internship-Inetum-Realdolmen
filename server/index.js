import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";

// put express functionality into app variable.
const app = express();
// body parser setup 
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// cors stuff
app.use(cors());
// base route api: "/api"
app.get('/api' , (res,req) => {
    req.send('welcome to the api');
});
// here comes the routes needed

// port
const PORT = process.env.PORT || 8081;
// start the server

app.listen(PORT, () => console.log("listening on port: " + PORT));