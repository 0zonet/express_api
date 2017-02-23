const express = require('express');
const router = express.Router();
const Movie = require('../lib/model/movie');


router
.post('/', function(req, res, next) {
    console.log(req.body);
    if(!req.body){
        res.status(403)
            .json({error: true,message : "Body empty"});
    }
    let _movie = req.body;

    // Save movie
    new Movie({
        title: _movie.title,
        year: _movie.year
    }).save()
        .then((movie)=>{
             res.status(201)
                .json(movie);
        });
})

.get('/', function(req, res, next) {
    Movie.find({}).then((movies)=>{
        res.status(200)
            .json({movies : movies});
    }).catch((err)=>{
         res.status(403)
            .json({err : err});
    });   
})

.get('/:id', function(req, res, next) {
    if(!req.params.id){
        res.status(403)
           .json({error: true,message : "params empty"});
    }
    
    let id = req.params.id;
    Movie.findOne({_id : id})
        .then((movie)=>{
             res.status(200)
            .json({movie : movie});
        }).catch((err)=>{
            res.status(403)
            .json({err : err});
        })
})

.put('/:id', function(req,res,next){
    if(!req.params.id){
        res.status(403)
        .json({error: true,message : "params empty"});
    }

    //UPDATE MOVIE
    let id = req.params.id;
    let new_movie = {
        title: req.body.title,
        year: req.body.year
    };

    Movie.findByIdAndUpdate(id,new_movie,{new: true})
        .then((movie)=>{
            res.status(200)
            .json({movie : movie});
        }).catch((err)=>{
            res.status(403)
            .json({err:err});
    });
})

.delete('/:id',function(req,res,next){
    if(!req.params.id){
         res.status(403)
        .json({error: true,message : "params empty"});
    }

    let id = req.params.id;
    //Eliminar peliculas 
    Movie.findByIdAndRemove(id)
        .then((resp)=>{
            res.status(400)
            .json({resp : resp});
        }).catch((err)=>{
            res.status(403)
                .json({err:err});
        });

})




module.exports = router;
