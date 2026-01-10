const router = require('express').Router()

router.post('/login', (req, res) => {
    res.json({ message: 'login route' })
})

router.post('/register', (req, res) => {
    res.json({ message: 'register route' })
})

module.exports = router
