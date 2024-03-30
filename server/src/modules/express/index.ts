/**
 * Import libraries
 */
import express = require('express');
import cors = require('cors');
import RouteManagement from '../route';

/**
 * MExpress
 */
export default class MExpress {
    private static instance: MExpress;
    public app: any;

    /**
     * Constructor
     */
    constructor() {
        this.app = express();
        this.app.use(cors({
            origin: "*"
        }));
        RouteManagement.init(this.app)
    }

    /**
     * Get instance
     */
    public static getInstance(): MExpress {
        if (!MExpress.instance) {
            MExpress.instance = new MExpress();
        }
        return MExpress.instance;
    }
}
