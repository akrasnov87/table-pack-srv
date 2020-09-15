var express = require('express');
var router = express.Router();

var fs = require('fs');
var join = require('path').join;
var fsUtil = require('../modules/fs-util');
var moment = require('moment');
var pkg = require('../package.json');


/* GET home page. */
router.get('/', async function(req, res, next) {

    var zip = join(__dirname, '../', 'public', 'zip');
    var csv = join(__dirname, '../', 'public', 'csv');
    var json = join(__dirname, '../', 'public', 'json');

    var zipItems = await fsUtil.getTables(zip);
    var csvItems = await fsUtil.getTables(csv);
    var jsonItems = await fsUtil.getTables(json);

    res.render('index', { 
        version: pkg.version,
        zip: zipItems,
        csv: csvItems,
        json: jsonItems,
        getDate: function (input) {
            return moment(new Date(input)).format("DD.MM.YYYY HH:mm:ss");
        },
        getSize: function (input) {
            return (parseInt(input) / 1024 / 1024).toFixed(2) + " Мб";
        }
    });
});


router.get('/:type', async function(req, res, next) {
    var folder = join(__dirname, '../', 'public', req.params.type);
    var items = await fsUtil.getTables(folder);
    res.json(items);
});

module.exports = router;
