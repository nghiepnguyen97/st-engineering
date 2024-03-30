
/**
 * Import routes
 */
import express = require('express');;
import { FILE_ROUTE } from '../base/file';
import { fileRoute } from '../items/file';

const mainRoute = express.Router();

/* Route */
mainRoute.use(FILE_ROUTE.file.path, fileRoute);

export { mainRoute };
