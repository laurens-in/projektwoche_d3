// let formattedTweets = []
let dates = [];
// let tweets

// dates.forEach(date => {
//     let someTweets = tweets.filter(tweet => tweet.date === date)

//     // filter out the one with most controversiality per date
//     let mostCon = someTweets.filter(x => x.controversiality === Math.max.apply(Math, someTweets.map(function (o) { return o.controversiality; })))
//     // now take the rest and add controversiality values
//     let sumCon = someTweets.filter(x => x.controversiality === Math.max.apply(Math, someTweets.map(function (o) { return o.controversiality; })))
//     sumCon.forEach(x => {
//         mostCon.controversiality = mostCon.controversiality + x.controversiality
//     })

//     formattedTweets.push(mostCon)
// })


'use strict';

const fs = require('fs');

let tweets


fs.readFile('tweets-try.json', (err, data) => {
    if (err) throw err;
    tweets = JSON.parse(data);
    tweets.forEach(x => {
        if (!dates.includes(x.date)) {
            dates.push(x.date)
        }
    })
    let formattedTweets = [];

    dates.forEach(date => {
        let someTweets = tweets.filter(tweet => tweet.date === date)

        // filter out the one with most controversiality per date
        let mostCon = someTweets.filter(x => x.controversiality === Math.max.apply(Math, someTweets.map(function (o) { return o.controversiality; })))[0]
        // now take the rest and add controversiality values
        let sumCon = someTweets.filter(x => x.controversiality !== Math.max.apply(Math, someTweets.map(function (o) { return o.controversiality; })))
        sumCon.forEach(x => {
            mostCon.controversiality = mostCon.controversiality + +x.controversiality
        })

        formattedTweets.push(mostCon)
    })



    console.log(formattedTweets);
    let exportData = JSON.stringify(formattedTweets);

    fs.writeFile('formated-tweets.json', exportData, function (err, result) {
        if (err) console.log('error', err);
    });
});