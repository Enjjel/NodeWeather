require('dotenv').config()

const {inquireMenu, pause, readInput, cityList} = require('./helpers/inquirer')
const Searches = require('./models/model_searches')


const main = async() => {

    let op = ''
    let search = new Searches()

    do
    {
        op = await inquireMenu()

        switch(op)
        {
            case '1':
                //rad input
                const place = await readInput()

                //search for places
                const places = await search.city(place)

                //select city
                const id = await cityList(places)
                if (id === '0') continue
                
                const placeSelected = places.find(place => place.id === id)

                search.addToHistory(placeSelected.name)

                const cityWeather = await search.cityWeather(placeSelected.lat, placeSelected.lon)

                console.log('\nInfo about the city:\n'.green);
                console.log('City: ', placeSelected.name.green);
                console.log('Lat: ', placeSelected.lat);
                console.log('Lon: ', placeSelected.lon);
                console.log('Temperature: ', cityWeather.temp + '°C'.yellow);
                console.log('Min: ', cityWeather.min);
                console.log('Max: ', cityWeather.max);
                console.log('How is the weather?: ', cityWeather.desc.green);
            break

            case '2':
                search.upperCaseHistory.forEach((place, i) => {
                    const index = `${i + 1}.`.green 
                    console.log(`${index} ${place}`);
                })
            break
        }

        await pause()      
    }while(op !== '0')
}


main()