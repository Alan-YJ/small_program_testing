const Koa = require('koa')
const app = new Koa()
const path = require('path')
const serve = require('koa-static')
const router = require('koa-router')()

const PORT = require('../config.server.json').PORT
const main = serve(path.join(__dirname,'static'))

const test = require('./cloud-functions/test/').main


app.use(main)

router.get('/api/test',function(ctx,next){
    test(ctx.request.query).then((res)=>{
        ctx.body = res
    }).catch((e)=>{
        console.error(e)
        next(e)
    })
})

app.use(router.routes())

app.listen(PORT,()=>{
    console.log(`server is working on : http://127.0.0.1:${PORT}`)
})