const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = new express();
const port = process.env.PORT || 3000;

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

//set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather App",
        name: "George Katsigiannis"
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About me",
        name: "George Katsigiannis"
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: "This is your help message",
        title: "Help",
        name: "George Katsigiannis"
    });
})

app.get('/weather', (req, res) =>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geoCode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error});
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })

        })
    })
})

app.get('/products', (req, res) =>{

    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query.search);
    
    res.send({
        products: []
    });
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: "George Katsigiannis",
        errorMessage: "Help article not found"
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: "George Katsigiannis",
        errorMessage: "Page not found"
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});