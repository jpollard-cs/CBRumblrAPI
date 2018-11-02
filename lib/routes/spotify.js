// Requirements

import express from 'express';

// Constants

const router = express.Router();

// API

import { spotifySearch } from '../api/spotify';

// Routes

router.get('/search/:searchQuery', function (req, res) {

	spotifySearch(req.params.searchQuery).then(function (json) {

		res.json(json);

	});

});

export default router;