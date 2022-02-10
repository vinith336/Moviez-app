const express = require('express')

const Movie = require('../models/movie')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = new express.Router()

router.post('/movies', auth, async (req, res) => {
    if (req.body.public) {
        req.body.public = true
    }
    const movie = new Movie({
        ...req.body,
        owner: req.user._id
    })
    try {
        await movie.save()
        res.redirect(`/movies?successToast=true&toastMessage=Added ${req.body.title} to list`)
    } catch (e) {
        console.log(e)
        res.redirect(`/movies?failureToast=true&toastMessage=Failed to add ${req.body.title}`)
    }
})

router.get('/movies', auth, async (req, res) => {
    try {
        var movie = null
        if (req.query.movie) {
            movie = await Movie.getMovieDetails(req.query.movie)
        }
        await req.user.populate('movies')
        if (!movie) {
            return res.render('movies', {
                title: req.query.movie,
                movies: false,
                list: req.user.movies,
                successToast: req.query.successToast ? req.query.successToast : false,
                failureToast: req.query.failureToast ? req.query.failureToast : false,
                toastMessage: req.query.toastMessage,
                userId: req.user.id
             })
        }
        res.render('movies', {
           title: req.query.movie,
           movies: [movie],
           list: req.user.movies,
           successToast: req.query.successToast ? req.query.successToast : false,
           failureToast: req.query.failureToast ? req.query.failureToast : false,
           toastMessage: req.query.toastMessage,
           userId: req.user.id
        })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/movies/me', auth, async (req, res) => {
    try {
        await req.user.populate('movies')
        res.render('list', {
            title: req.query.movie,
            movies: req.user.movies,
         })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/movies/me/delete', auth, async (req, res) => {
    try{
        const movie = await Movie.findOneAndDelete({_id: req.body.id, owner: req.user._id})
        if (!movie) {
            return res.redirect('/movies?successToast=true&toastMessage=Movie deleted')
        }
        res.redirect('/movies?successToast=true&toastMessage=Movie deleted')
    } catch(e){
        res.redirect('/movies?failureToast=true&toastMessage=Movie deletion failed')
    }
})

router.get('/movies/share/:id', async (req, res) => {
    try {
        let movies = await Movie.find({ owner: req.params.id, public: true })
        let user = await User.findById(req.params.id)
        if (movies.length == 0) {
            movies = false
        }
        res.render('shared', {
            movies,
            name: user.name
        })
    } catch (e) {
        res.redirect('/')
    }
})

module.exports = router