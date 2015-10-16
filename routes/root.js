/**
 * Created by Eamonn on 2015/9/17.
 */
var fileController = require('../app_modules/fileController.js');

module.exports = function(app){
    app.get('/',function(req,res){
        if(req.query.room){
            res.render('index3',{title:'MultiDraw'});
        }else{
            res.redirect('/start')
        }
    });

    app.get('/start',function(req,res){
        res.render('index',{title:'MultiDraw'});
    });

    app.get('/users',function(req,res){

    });

    app.post('/save',function(req,res){
        fileController.save(req,res);
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    return app;
};