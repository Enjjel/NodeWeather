const axios = require('axios')
const fs = require('fs')

class Searches {
    history = []
    path_bd = './db/file_history.json'

    constructor() {
        this.readDB()
    }

    get paramsMapbox()
    {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'en'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': '27d25c00f854a82cce5ee240965ccb95',
            'units': 'metric'
        }
    }

    get upperCaseHistory() {
        return this.history.map(place => {
            let words = place.split(' ')
            words = words.map(word => word[0].toUpperCase() + word.substring(1))

            return words.join(' ')
        })
    }

    async city(place = '') {
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            })

            const res = await instance.get()
            return res.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lat: place.center[1],
                lon: place.center[0]
            }))
        } catch (error) {
            throw new Error('error')
        }
    }

    async cityWeather(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon}
            })

            const res = await instance.get()
            const {main, weather} = res.data

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            throw new Error('error')
        }

    }

    addToHistory(place = '') {

        
        if (this.history.includes(place.toLocaleLowerCase())) return

        this.history = this.history.splice(0, 5)

        this.history.unshift(place.toLocaleLowerCase())

        this.saveBD()
    }

    saveBD() {
        const payload = { history: this.history }

        fs.writeFileSync(this.path_bd, JSON.stringify(payload))
    }

    readDB() {
        if (!fs.existsSync(this.path_bd)) return null

        const file_data = fs.readFileSync(this.path_bd)
        const data = JSON.parse(file_data)

        this.history = data.history
    }

    // loadDataFromFile(data_array = []) {
    //     data_array.forEach(item => {
    //         this.history.push(item)
    //     })
    // }
}


module.exports = Searches