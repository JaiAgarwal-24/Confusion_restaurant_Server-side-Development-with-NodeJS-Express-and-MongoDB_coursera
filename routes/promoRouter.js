const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors')

const Promos = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promos.find(req.query)
            .then((promos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(promos);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.create(req.body)
            .then((promo) => {
                console.log("Promotion Created" + promo)
                res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.deleteMany({})
            .then((resps) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resps);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Promos.findById(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo)
            }, (err) => next(err))
            .then((err) => next(err));
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /promotions/' + req.params.promoId);
    })
    .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.findByIdAndUpdate(req.params.promoId,{ $set: req.body}, {new: true})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.findByIdAndRemove(req.params.promoId)
            .then((resps) => {
                res.statusCode = 200;
                res.setHeader('content-type', 'application/json');
                res.json(resps)
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = promoRouter;