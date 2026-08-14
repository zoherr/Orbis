import app from "./app.js"
import env from "./config/env.config.js"
import connectDb from "./lib/connectDb.js";


app.listen(env.PORT, () => {
    connectDb()
    console.log(`SERVER IS RUNNING ON PORT:${env.PORT}`);
})