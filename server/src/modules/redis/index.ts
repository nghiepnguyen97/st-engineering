/**
 * Import libraries
 */
import * as redis from 'redis';
import * as util from 'util';

/**
 * Import utils
 */

import { CONFIGS, IConfigRedis } from '../global/variable';

/**
 * Redis
 */
export default class Redis {
    private static instance: Redis;
    private isConnected: boolean;
    private configs: IConfigRedis;
    public client: any;

    /**
     * init
     * @param data
     */
    constructor (data: {
        configs: IConfigRedis
    }) {
        this.configs = data.configs;
        const options = {
            url: `redis://${this.configs.host}:${this.configs.port}`,
            password: this.configs.password,
        };

        this.client = redis.createClient(options);
        this.client.get = util.promisify(this.client.get);
        this.isConnected = false;

        this.client.on('connect', () => {
            this.isConnected = true;
            console.log('Connect Redis is successful');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            console.log('[Redis] error: ', err);
        });

        this.client.on('end', (err) => {
            this.isConnected = false;
            console.log('[Redis] closed: ', err);
        });

        this.client.on('reconnecting', (err) => {
            console.log('[Redis] reconnecting');
        });
    }

    /**
     * init
     */
    public async init(): Promise<void> {
        await this.client.connect();
        await this.clearAll();
    }

    /**
     * Get instance
     */
    public static async getInstance(): Promise<Redis> {
        if (!Redis.instance) {
            Redis.instance = new Redis({
                configs: CONFIGS.redis
            });
            await Redis.instance.init();
        }
        return Redis.instance;
    }

    /**
     * Get data by key
     * @param key
     */
    public async get(key: string): Promise<any> {
        if (!this.isConnected) {
            return null;
        }
        return JSON.parse(await this.client.sendCommand([
            'GET',
            key
        ]));
    }

    /**
     * Set data by key
     * @param key
     * @param value
     */
    public async set(key: string, value: any): Promise<void> {
        if (this.isConnected) {
            await this.client.sendCommand([
                'SET',
                key,
                JSON.stringify(value)
            ]);
        }
    }

    /**
     * Set data by key
     * @param key
     */
    public async del(key: string): Promise<void> {
        if (this.isConnected) {
            await this.client.sendCommand([
                'DEL',
                key
            ]);
        }
    }

    /**
     * Clear all
     */
    public async clearAll(): Promise<void> {
        if (this.isConnected) {
            await this.client.sendCommand([
                'FLUSHALL'
            ]);
        }
    }
}
