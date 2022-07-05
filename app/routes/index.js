const express = require('express');
const router = express.Router();


router.get('/', (req, res, next)=>{
    res.send('Hello World!');
    next();
})

// router.get('/:id', (req, res)=>{
//     //let id = req.params.id;
//     res.send(`The id is ${req.params.id}`);
// });

// router.get('/p/:tagId', function(req, res) {
//     res.send("tagId is set to " + req.params.tagId);
// });

router.use('/auth', require('./auth'));

module.exports = router;

