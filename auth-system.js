const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
require('dotenv').config();

// Almacenamiento simple en memoria (en producción usar base de datos)
const users = new Map();

class AuthSystem {
    constructor() {
        this.initializePassport();
    }

    initializePassport() {
        // Configuración de Passport
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_REDIRECT_URI,
            profileFields: ['id', 'displayName', 'photos', 'email', 'groups']
        }, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Buscar o crear usuario
                let user = users.get(profile.id);
                
                if (!user) {
                    user = {
                        id: profile.id,
                        name: profile.displayName,
                        email: profile.emails ? profile.emails[0].value : '',
                        photo: profile.photos ? profile.photos[0].value : '',
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        groups: [],
                        createdAt: new Date()
                    };
                    users.set(profile.id, user);
                } else {
                    // Actualizar token
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken;
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));

        // Serialización del usuario
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            const user = users.get(id);
            done(null, user);
        });
    }

    getMiddleware() {
        return [
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 24 * 60 * 60 * 1000 // 24 horas
                }
            }),
            passport.initialize(),
            passport.session()
        ];
    }

    getRoutes() {
        const router = require('express').Router();

        // Ruta de login
        router.get('/facebook', passport.authenticate('facebook', {
            scope: [
                'public_profile', 
                'email', 
                'publish_to_groups',
                'groups_access_member_info',
                'pages_manage_posts'
            ]
        }));

        // Callback de Facebook
        router.get('/facebook/callback', 
            passport.authenticate('facebook', { 
                failureRedirect: '/login',
                successRedirect: '/dashboard'
            })
        );

        // Logout
        router.get('/logout', (req, res) => {
            req.logout((err) => {
                if (err) {
                    return res.redirect('/');
                }
                req.session.destroy(() => {
                    res.redirect('/');
                });
            });
        });

        // Verificar autenticación
        router.get('/user', (req, res) => {
            if (req.isAuthenticated()) {
                res.json({
                    authenticated: true,
                    user: {
                        id: req.user.id,
                        name: req.user.name,
                        email: req.user.email,
                        photo: req.user.photo
                    }
                });
            } else {
                res.json({ authenticated: false });
            }
        });

        return router;
    }

    // Middleware para proteger rutas
    requireAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ error: 'No autenticado' });
    }

    // Obtener usuario actual
    getCurrentUser(req) {
        return req.user;
    }

    // Actualizar tokens del usuario
    updateUserTokens(userId, accessToken, refreshToken) {
        const user = users.get(userId);
        if (user) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            return true;
        }
        return false;
    }

    // Obtener todos los usuarios (para administración)
    getAllUsers() {
        return Array.from(users.values());
    }
}

module.exports = AuthSystem;
