'use strict';

const fs = require('fs');

let tweets
const getCon = (L, R) => { return Math.log((L + R) / 2) / Math.log(2); }


fs.readFile('trump.json', (err, data) => {
    if (err) throw err;
    tweets = JSON.parse(data);
    tweets.forEach(x => {
        x.date = new Date(x.date).toISOString().substring(0, 10)
        console.log(x.date)
        if (x.favorites === "0") {
            x.favorites = "1"
        }
        if (x.retweets === "0") {
            x.retweets = "1"
        }
        delete x.id
        delete x.isRetweet
        x.controversiality = getCon(parseInt(x.retweets), parseInt(x.favorites))
        delete x.retweets
        delete x.favorites

    })
    console.log(tweets[0]);
    let exportData = JSON.stringify(tweets);

    fs.writeFile('tweets-try.json', exportData, function (err, result) {
        if (err) console.log('error', err);
    });
});


let formattedTweets = []
let dates;
let tweets

dates.forEach(date => {
    let someTweets = tweets.filter(tweet => tweet.date === date)

    // filter out the one with most controversiality per date
    let mostCon = someTweets.filter(x => x.controversiality === Math.max.apply(Math, someTweets.map(function (o) { return o.controversiality; })))
    // now take the rest and add controversiality values
    let sumCon = someTweets.filter(x => x.controversiality === Math.max.apply(Math, someTweets.map(function (o) { return o.controversiality; })))
    sumCon.forEach(x => {
        mostCon.controversiality = mostCon.controversiality + x.controversiality
    })

    formattedTweets.push(mostCon)
})


