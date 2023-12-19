module.exports = {
    getIndex: (request, response) => {
        console.log('getindex')
        response.render('index.ejs') 
    }
}
