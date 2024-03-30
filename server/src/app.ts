/**
 * Import server
 */
import Server from './modules/server';

/**
 * Call server
 */
(async () => {
    await Server.getInstance();
})();
