/**
 * @file routes/index.js
 * @project table-pack-srv
 * @author Aleksandr Krasnov
 */

var express = require('express');
var router = express.Router();

var join = require('path').join;
var fsUtil = require('table-pack/modules/fs-util');
var moment = require('moment');
var pkg = require('../package.json');


/**
 * Главная страница
 */
router.get('/', async function(req, res, next) {

    var csvZip = join(__dirname, '../', 'public', 'csv-zip');
    //var csv = join(__dirname, '../', 'public', 'csv');
    //var json = join(__dirname, '../', 'public', 'json');
    //var jsonZip = join(__dirname, '../', 'public', 'json-zip');

    //var csvItems = await fsUtil.getTables(csv);
    var csvZipItems = await fsUtil.getTables(csvZip);
    //var jsonItems = await fsUtil.getTables(json);
    //var jsonZipItems = await fsUtil.getTables(jsonZip);

    res.render('index', { 
        version: pkg.version,
        //csv: csvItems,
        csvZip: csvZipItems,
        //json: jsonItems,
        //jsonZip: jsonZipItems,
        getDate: function (input) {
            return moment(new Date(input)).format("DD.MM.YYYY HH:mm:ss");
        },
        getSize: function (input) {
            return (parseInt(input) / 1024 / 1024).toFixed(2) + " Мб";
        }
    });
});

/**
 * Получение информации о таблицах с указанным типом
 * @example
 * /csv-zip 
 */
router.get('/:type', async function(req, res, next) {
    var folder = join(__dirname, '../', 'public', req.params.type);
    var items = await fsUtil.getTables(folder);
    res.json(items);
});

module.exports = router;
