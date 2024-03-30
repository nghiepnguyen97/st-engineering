import { BASE_MAIN_ROUTE } from './base';
import { mainRoute } from './main';


export default class RouteManagement {
    public static init (app: any) {
        app.use(BASE_MAIN_ROUTE.main.path, mainRoute);
    }
}


