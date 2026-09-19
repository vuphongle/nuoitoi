// import { Injectable, Logger } from "@nestjs/common";
// import { ConfigService as NestConfigService } from "@nestjs/config";

// @Injectable()
// export class ConfigService {
//     private readonly logger = new Logger(ConfigService.name);

//     constructor(private readonly configService: NestConfigService) {
//         this.logConfig();
//     }

//     get port(): number {
//         return this.mustGet<number>("PORT");
//     }

//     get databaseUrl(): string {
//         return this.mustGet("DATABASE_URL");
//     }

//     get domainFe(): string {
//         return this.mustGet("DOMAIN_FE");
//     }

//     get domainBe(): string {
//         return this.mustGet("DOMAIN_BE");
//     }

//     get redisUrl(): string {
//         return this.mustGet("REDIS_URL");
//     }

//     get tgBotToken(): string {
//         return this.mustGet("TG_BOT_TOKEN");
//     }

//     get tgChatId(): string {
//         return this.mustGet("TG_CHAT_ID");
//     }

//     get tgThreadId(): string {
//         return this.mustGet("TG_THREAD_ID");
//     }

//     get magicLinkTokenSecret(): string {
//         return this.mustGet("MAGIC_LINK_TOKEN_SECRET");
//     }

//     get magicLinkTokenExpires(): string {
//         return this.mustGet("MAGIC_LINK_TOKEN_EXPIRES");
//     }

//     get magicLinkEmailSecret(): string {
//         return this.mustGet("MAGIC_LINK_EMAIL_SECRET");
//     }

//     get accessTokenSecret(): string {
//         return this.mustGet("ACCESS_TOKEN_SECRET");
//     }

//     get accessTokenExpires(): string {
//         return this.mustGet("ACCESS_TOKEN_EXPIRES");
//     }

//     get refreshTokenSecret(): string {
//         return this.mustGet("REFRESH_TOKEN_SECRET");
//     }

//     get refreshTokenExpires(): string {
//         return this.mustGet("REFRESH_TOKEN_EXPIRES");
//     }

//     get googleClientId(): string {
//         return this.mustGet("GOOGLE_CLIENT_ID");
//     }

//     get googleClientSecret(): string {
//         return this.mustGet("GOOGLE_CLIENT_SECRET");
//     }

//     get totpEnabled(): boolean {
//         return this.mustGet<boolean>("TOTP_ENABLED");
//     }

//     get emailHost(): string {
//         return this.mustGet<string>("EMAIL_HOST");
//     }

//     get emailPort(): number {
//         return this.mustGet<number>("EMAIL_PORT");
//     }

//     get emailUser(): string {
//         return this.mustGet<string>("EMAIL_USER");
//     }

//     get emailPass(): string {
//         return this.mustGet<string>("EMAIL_PASS");
//     }

//     get emailFrom(): string {
//         return this.mustGet<string>("EMAIL_FROM");
//     }

//     get cloudinaryName(): string {
//         return this.mustGet<string>("CLOUDINARY_NAME");
//     }

//     get cloudinaryApiKey(): string {
//         return this.mustGet<string>("CLOUDINARY_API_KEY");
//     }

//     get cloudinaryApiSecret(): string {
//         return this.mustGet<string>("CLOUDINARY_API_SECRET");
//     }

//     private logConfig() {
//         this.logger.log(`✅ PORT: ${this.port}`);
//         this.logger.log(`✅ DATABASE_URL: ${this.databaseUrl.slice(0, 5)}...`);
//         this.logger.log(`✅ REDIS_URL: ${this.redisUrl.slice(0, 5)}...`);
//         this.logger.log(`✅ DOMAIN_BE: ${this.domainBe}...`);
//         this.logger.log(`✅ DOMAIN_FE: ${this.domainFe}...`);

//         this.logger.log(`✅ TG_BOT_TOKEN: ${this.tgBotToken.slice(0, this.tgBotToken.length / 2)}...`);
//         this.logger.log(`✅ TG_CHAT_ID: ${this.tgChatId.slice(0, this.tgChatId.length / 2)}...`);
//         this.logger.log(`✅ TG_THREAD_ID: ${this.tgThreadId.slice(0, this.tgThreadId.length / 2)}...`);

//         this.logger.log(`✅ MAGIC_LINK_TOKEN_SECRET: ${this.magicLinkTokenSecret.slice(0, this.magicLinkTokenSecret.length / 2)}...`);
//         this.logger.log(`✅ MAGIC_LINK_TOKEN_EXPIRES: ${this.magicLinkTokenExpires}`);
//         this.logger.log(`✅ MAGIC_LINK_EMAIL_SECRET: ${this.magicLinkEmailSecret.slice(0, this.magicLinkEmailSecret.length / 2)}`);

//         this.logger.log(`✅ ACCESS_TOKEN_SECRET: ${this.accessTokenSecret.slice(0, this.accessTokenSecret.length / 2)}...`);
//         this.logger.log(`✅ ACCESS_TOKEN_EXPIRES: ${this.accessTokenExpires}`);

//         this.logger.log(`✅ REFRESH_TOKEN_SECRET: ${this.refreshTokenSecret.slice(0, this.refreshTokenSecret.length / 2)}...`);
//         this.logger.log(`✅ REFRESH_TOKEN_EXPIRES: ${this.refreshTokenExpires}`);

//         this.logger.log(`✅ GOOGLE_CLIENT_ID: ${this.googleClientId.slice(0, this.googleClientId.length / 2)}...`);
//         this.logger.log(`✅ GOOGLE_CLIENT_SECRET: ${this.googleClientSecret.slice(0, this.googleClientSecret.length / 2)}...`);

//         this.logger.log(`✅ TOTP_ENABLED: ${this.totpEnabled}`);

//         this.logger.log(`✅ EMAIL_HOST: ${this.emailHost.slice(0, this.emailHost.length / 2)}...`);
//         this.logger.log(`✅ EMAIL_PORT: ${this.emailPort}...`);
//         this.logger.log(`✅ EMAIL_USER: ${this.emailUser.slice(0, this.emailUser.length / 2)}...`);
//         this.logger.log(`✅ EMAIL_PASS: ${this.emailPass.slice(0, this.emailPass.length / 2)}...`);
//         this.logger.log(`✅ EMAIL_FROM: ${this.emailFrom.slice(0, this.emailFrom.length / 2)}...`);

//         this.logger.log(`✅ CLOUDINARY_NAME: ${this.cloudinaryName.slice(0, this.cloudinaryName.length / 2)}...`);
//         this.logger.log(`✅ CLOUDINARY_API_KEY: ${this.cloudinaryApiKey.slice(0, this.cloudinaryApiKey.length / 2)}...`);
//         this.logger.log(`✅ CLOUDINARY_API_SECRET: ${this.cloudinaryApiSecret.slice(0, this.cloudinaryApiSecret.length / 2)}...`);
//     }

//     /**
//      * Helper method to safely get a required env var.
//      * Throws or exits if not found.
//      */
//     private mustGet<T>(key: string): T {
//         const value = this.configService.get<T>(key);

//         if (value === null || value === undefined) {
//             this.logger.error(`❌ Missing required config: ${key}`);

//             // Option 1: throw error to let NestJS crash
//             throw new Error(`Missing config: ${key}`);

//             // Option 2: exit process immediately (optional if outside bootstrap)
//             // process.exit(1);
//         }

//         return value;
//     }
// }
