// import { Global, Module } from "@nestjs/common";
// import { ConfigModule as NestConfigModule } from "@nestjs/config";
// import { envValidation } from "./env.validation";
// import { ConfigService } from "./config.service";

// @Global()
// @Module({
//     imports: [
//         NestConfigModule.forRoot({
//             isGlobal: true,
//             envFilePath: ".env",
//             validationSchema: envValidation,
//             validationOptions: {
//                 convert: true,
//             },
//         }),
//     ],
//     providers: [ConfigService],
//     exports: [ConfigService],
// })
// export class ConfigModule {}

// // gắn ConfigModule ở import trong file app.module.ts để sử dụng
