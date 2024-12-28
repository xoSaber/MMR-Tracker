const f = require('./test.js');

const express = require('express')
const app = express()
const PORT = 8080

app.use( express.json() )

app.get('/tshirt', async (req, res) => {
    res.status(200).send({
         tshirt: await f.main("Watching Me","hawk"),
    })
});


app.post('/tshirt/:id', (req, res) => {
    const { id } = req.params;
    const { logo } = req.body

    if (!logo) {
        res.status(418).send({message: 'XD'})
    }
    
    res.send({
        tshirt: `T with your ${logo}`
    });

});

app.listen(
  PORT,
  () => console.log(`it's alive on http://localhost:${PORT}`)
)