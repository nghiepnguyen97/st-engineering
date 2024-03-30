/**
 * Import libraries
 */
import * as config from 'config';

/**
 * IConfigRedis
 */
export interface IConfigRedis {
    host: string;
    port: number;
    password: string;
}


/**
 * IConfigServer
 */
export interface IConfigServer {
    fileUpload: string;
}

export interface IConfigApplication {
    env: string;
    port: number;
    server: IConfigServer,
    redis: IConfigRedis;
}

export const CONFIGS: IConfigApplication = <any>config;