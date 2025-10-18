const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
require('dotenv').config();

class AuthSystem {
    constructor() {
        this.redisClient = null;
        this.initializeRedis();
    }

    async initializeRedis() {
        try {
            // Conectar a Redis (Railway provee la URL automáticamente)
            this.redisClient = createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });
            
            this.redisClient.on('error', (err) => {
                console.log('Redis error:', err);
            });
            
            await this.redisClient.connect();
            console.log('✅ Conectado a Redis');
            
        } catch (error) {
            console.log('❌ Redis no disponible, usando memoria:', error.message);
        }
        
        this.initializePassport();
    }

    initializePassport() {
        // Configuración de Passport (igual que antes)
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_REDIRECT_URI,
            profileFields: ['id', 'displayName', 'photos', 'email', 'groups']
        }, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Almacenar usuario en Redis si está disponible
                const user = {
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.emails ? profile.emails[0].value : '',
                    photo: profile.photos ? profile.photos[0].value : '',
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    groups: [],
                    createdAt: new Date()
                };
                
                if (this.redisClient) {
                    await this.redisClient.set(`user:${profile.id}`, JSON.stringify(user));
                }
                
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            try {
                if (this.redisClient) {
                    const userData = await this.redisClient.get(`user:${id}`);
                    if (userData) {
                        return done(null, JSON.parse(userData));
                    }
                }
                // Fallback a memoria si Redis no está disponible
                done(null, null);
            } catch (error) {
                done(error, null);
            }
        });
    }

    getMiddleware() {
        const sessionConfig = {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 horas
            }
        };
        
        // Usar Redis Store si está disponible
        if (this.redisClient) {
            sessionConfig.store = new RedisStore({ 
                client: this.redisClient 
            });
        }
        
        return [
            session(sessionConfig),
            passport.initialize(),
            passport.session()
        ];
    }

    // ... el resto del código igual
}

module.exports = AuthSystem;
