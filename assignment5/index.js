const express = require('express'); 
const nedb = require("nedb-promises"); 


const port = 4000;
const app = express();
const db = nedb.create('assignment5.json'); // init db

app.use(express.static("public"));



app.get('/hits/:pageId', async (req, res)=>{
    const pageId = req.params.pageId
    console.log(pageId)
    let page = await db.findOne({pageId})

    if(page){

        page.hits += 1
        await db.update({pageId}, {$set: {hits: page.hits}});
    }else{
        page = {pageId, hits: 1};
        await db.insert(page);
    }
    
    res.send((page.hits).toString());
});

app.all("*", (req, res)=>{
    res.status(404).send("Invalid URL....")
})

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
});