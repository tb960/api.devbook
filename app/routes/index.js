const express = require('express');
const router = express.Router();


// router.get('/de', (req, res, next)=>{
//     var greeting = res.__n('%s cat', 3);
//     res.send(greeting);
//     next();
// })

router.get('/', (req, res, next)=>{
    res.send("You shouldn't reach here!");
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

