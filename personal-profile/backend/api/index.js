"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
let app;
exports.default = async (req, res) => {
    if (!app) {
        app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: false,
        });
        const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
        app.enableCors({
            origin: [frontendOrigin],
            credentials: true,
        });
        app.setGlobalPrefix('api');
        await app.init();
    }
    const server = app.getHttpAdapter().getInstance();
    server(req, res);
};
//# sourceMappingURL=index.js.map