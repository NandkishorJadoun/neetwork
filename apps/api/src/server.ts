import app from "./app.js";
import { env } from "./configs/env.js";
import { logger } from "./configs/logger.js";

app.listen(env.PORT, () => {
    logger.info("Server is running on port %d", env.PORT)
})