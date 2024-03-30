import Redis from '../modules/redis';
import FileService from './services/file';

export default class AppResource {
    protected static instance: AppResource;
    public mRedis: Redis;
    public svFile: FileService;

    /**
     * Get instance
     * @returns 
     */
    public static async getInstance(): Promise<AppResource> {
        if (!AppResource.instance) {
            AppResource.instance = new AppResource();
            await AppResource.instance.init();
        }

        return AppResource.instance;
    }

    /**
     * Init
     */
    public async init(): Promise<void> {
        this.mRedis = await Redis.getInstance();
        this.svFile = await FileService.getInstance();
    }

}