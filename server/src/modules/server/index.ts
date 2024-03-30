/**
 * Import libraries
 */
import * as http from 'http';
import * as fs from 'fs';

/**
 * Import configs
 */
import { CONFIGS } from '../global/variable';
import Redis from '../../modules/redis';
import MExpress from '../../modules/express';
/**
 * Server
 */
export default class Server {
    private static instance: Server;
    public server: http.Server;
    public port: number = CONFIGS.port;

    /**
     * Get instance
     */
    public static async getInstance(): Promise<Server> {
        if (!Server.instance) {
            Server.instance = new Server();
            await Server.instance.init();
        }

        return Server.instance;
    }

    /**
     * Init server
     */
    public async init(): Promise<void> {
        await Redis.getInstance();
        this.server = http.createServer(MExpress.getInstance().app);
        this.server.listen(this.port);

        // Clean data
        const filePath = `${CONFIGS.server.fileUpload}/data.csv`;
        if (fs.existsSync(filePath)) {
            await fs.unlinkSync(`${CONFIGS.server.fileUpload}/data.csv`);
        }
    }
}
