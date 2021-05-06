const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.bloam.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// DB Schema
const personSchema = {
  name: String,
  number: String
}

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})

if(name && number) {
  person.save().then(response => {
    console.log('added '+ name + ' number ' + number + ' to phonebook')
    mongoose.connection.close()
  })
} else {
  console.log("phonebook:")
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note.name+" "+note.number)
    })
    mongoose.connection.close()
  })
}
