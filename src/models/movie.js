const { default: axios } = require('axios')
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    year: {
        type: String,
        trim: true,
        required: true
    },
    plot: {
        type: String,
        trim: true,
        required: true
    },
    rating: {
        type: String,
        trim: true,
        required: true
    },
    public: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

movieSchema.statics.getMovieDetails = async (movieName) => {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${movieName}`)
    if (response.data.Response == "False") {
        return false
    }
    return {
        title: response.data.Title,
        year: response.data.Year,
        plot: response.data.Plot,
        rating: response.data.imdbRating
    }
}

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie