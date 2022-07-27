const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Favorites.find({user: req.user._id})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite !== null) {
                    for (var i = (req.body.length -1); i>=0; i--){
                        if (favorite.dishes.indexOf(req.body[i]._id) > -1){
                            console.log("Dish already exists in Favorite")
                        }
                        else{
                            favorite.dishes.push(req.body[i]._id);
                            console.log("Dish added to Favorite")
                        }
                    }
                    favorite.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err))
                                .catch((err) => next(err));
                }
                else {
                    Favorites.create({ user: req.user._id, dishes: [] })
                        .then((favorite) => {
                            for (var i = (req.body.length -1); i>=0; i--){
                                favorite.dishes.push(req.body[i]._id);
                            }
                            favorite.save()
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(favorite)
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favorites");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({ user: req.user._id })
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .get(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("GET operation not supported on /favorites");
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite !== null) {
                    // if (Favorites.findOne({ user: req.user._id , dishes: req.params.dishId })){
                    if (favorite.dishes.indexOf(req.params.dishId) > -1) {
                        res.statusCode = 403;
                        res.end("Dish already exists in favorite");
                    }
                    else {
                        favorite.dishes.push(req.params.dishId)
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                }
                else {
                    Favorites.create({ user: req.user._id, dishes: req.params.dishId })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(favorite)
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favorites");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite !== null) {
                    if (favorite.dishes.indexOf(req.params.dishId) > -1) {
                        favorite.dishes.remove(req.params.dishId);
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                    else {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Dish is not present in favorites");
                    }
                }
                else {
                    res.statusCode = 403;
                    res.end("There are no Favorites present for user " + req.user._id);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;