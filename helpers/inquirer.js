const inquirer = require('inquirer')
require('colors')

const questions = [{
    type: 'list',
    name: 'option',
    message: 'Select an option'.green,
    choices: [
        {value: '1', name: `${'1.'.green} Search City`},
        {value: '2', name: `${'2.'.green} Search History`},
        {value: '0', name: `${'0.'.green} Exit`}
    ]
}]

const pause_enter = [{
    type: 'input',
    name: 'input_pause',
    message: `Press ${'ENTER'.green} to continue`
}]


const inquireMenu = async() => {
    console.clear()

    const {option} = await inquirer.prompt(questions)

    return option
}

const pause = async() => {
    await inquirer.prompt(pause_enter)
}


const readInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'city',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Please, enter a valid value'
                }
                return true
            }
        }
    ]

    const {city} = await inquirer.prompt(question)
    return city
}

const cityList = async(cities = []) => {

        const choices = cities.map((city, i) => {
            
            const idx = `${i + 1}.`.green
            
            return {
                value : city.id,
                name : `${idx} ${city.name}`
            }
        })

        choices.unshift({
            value: '0',
            name: '0.'.green + ' Cancel'
        })

        const questions = [{
            type: 'list',
            name: 'city',
            message: 'Select an option:',
            choices
        }]

        const {city} = await inquirer.prompt(questions)

        return city
}

const checkList = async(tasks = []) => {

    const choices = tasks.map((task, i) => {
        
        const idx = `${i + 1}.`.green
        
        return {
            value : task.id,
            name : `${idx} ${task.desc}`,
            checked: (task.completed) ? true : false 
        }
    })

    const questions = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Selections',
        choices
    }]

    const {ids} = await inquirer.prompt(questions)

    return ids
}

const confirmDelete = async(message) => {
    const question = [{
        type: 'confirm',
        name: 'choice',
        message
    }]

    const {choice} = await inquirer.prompt(question)

    return choice
}


module.exports = {inquireMenu, pause, readInput, cityList, confirmDelete, checkList}