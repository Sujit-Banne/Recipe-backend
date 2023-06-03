const express = require('express')
const router = express.Router()
const recipeSchema = require('../models/recipe')

//add recipe
router.post('/add-recipe', async (req, res) => {
    try {
        const recipeData = req.body;

        // Check if a recipe with the same title already exists
        const existingRecipe = await recipeSchema.findOne({ title: recipeData.title });
        if (existingRecipe) {
            return res.status(400).json({ message: 'Recipe with the same title already exists' });
        }

        const recipe = new recipeSchema(recipeData);
        await recipe.save();
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get all recipe
router.get('/', async (req, res) => {
    const userId = req.userId
    try {
        const recipe = await recipeSchema.find({ userId })
        if (!recipe) {
            res.status(400).json({ message: "No Recipe found for this user" })
        } else {
            res.status(200).json(recipe)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

//get recipe by id
router.get('/:id', async (req, res) => {
    const id = req.params.id
    const userId = req.userId
    try {
        const recipe = await recipeSchema.findOne({ _id: id, userId })
        if (!recipe) {
            res.status(400).json({ message: "no recipe found by this id" })
        } else {
            res.status(200).json(recipe)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

//delete recipe
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const userId = req.userId
    try {
        const recipe = await recipeSchema.findByIdAndDelete({ _id: id, userId })
        if (!recipe) {
            res.status(400).json({ message: "no recipe find by that id" })
        } else {
            res.status(200).json({ message: "recipe deleted", recipe })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

//update recipe
router.put('/:id', async (req, res) => {
    const id = req.params.id
    const userId = req.userId
    const { title, description, ingredients, instructions } = req.body
    try {
        const recipe = await recipeSchema.findByIdAndUpdate(
            { _id: id, userId },
            { title, description, ingredients, instructions },
            { new: true }
        )
        if (!recipe) {
            res.status(400).json({ message: "no recipe found by this id" })
        } else {
            res.status(200).json({ message: "recipe updated", recipe })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }
})

module.exports = router
