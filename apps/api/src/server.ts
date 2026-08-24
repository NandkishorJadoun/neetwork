import app from "./app.js";
import { env } from "./schemas/env.schema.js";

app.listen(env.PORT, () =>{
    console.log(`Server is running on port ${env.PORT}`)
})