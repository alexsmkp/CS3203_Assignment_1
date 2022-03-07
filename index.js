/**
 * Author: Aleksandr Semikopenko.
 * Assignment 1 for CS3203 Spring 2022.
 * 
 * This program retrieves information from a given JSON file with Twitter data 
 * and performs various tasks on such as displaying and updating certain parameters of the tweets 
 * as well as creating and deleting an entrire tweet.
 * 
 * Refer to Readme.md for detailed instructions.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const StringBuilder = require('node-stringbuilder');
const { type, json } = require('express/lib/response');
const { stringify } = require('querystring');
const moment = require('moment');
const { name } = require('ejs');
const res = require('express/lib/response');
const app = express();
//set the view engine to ejs.
app.set('view engine', 'ejs');
const port = 3000;
//Initialize the variable that will carry the output data for the front-end display.
let passedData = '';
let twitterList = '';
let jsonData;
const defaultName = 'favs.json'; //The default JSON file
let fileName = defaultName; 

//Custom function that updates the tweet list in 'twitterList' 
function updateTwitter()
{
    sb2 = new StringBuilder;
    jsonData.forEach(tweet => {
        sb2.appendLine(`Tweet ${jsonData.indexOf(tweet)+1}: ${tweet.text} | ID:${tweet.id_str} Created at: ${tweet.created_at} | by ${tweet.user.name} (screen_name: ${tweet.user.screen_name} ID:${tweet.user.id})\n`)
    });
    twitterList = sb2.toString(); 
}

function loadJson(file)
{
    //Read the JSON file.
    let rawData = fs.readFileSync(`./${file}`);
    //Convert the JSON file into a JS object.
    jsonData = JSON.parse(rawData);
}




//middleware functions
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//Listener for a GET request that renders the front-end page in the default state.
app.get('/', (req,res)=>
{
    loadJson(fileName);
    updateTwitter();
    res.render('index',{passedData,twitterList,fileName});
}); 

//Listener for a POST request.
app.post('/', (req,res)=>
{
    console.log(`New POST request with query ?action=${req.query.action} | ${moment()}`);
    //The StringBuider will be used to build the output string for the front-end.
    sb1 = new StringBuilder();

    //The switch allows to detremine which button triggered the POST request by comparing the received query parameter.
    switch(req.query.action)
    {
        case "save_file":
        {
            saveFileName = req.body.file_name;
            fs.writeFileSync(`./${saveFileName}.json`,JSON.stringify(jsonData, null, 2));
            break;
        }
        case "load_file": 
        {
            fileName = req.body.file_name;
            loadJson(fileName);  
            break;  
        }
        case "clear":
        {
            sb1.append("");
            break;
        }
        case "get_all_tweets": //Outputs all tweets with the creation timestamp by looping through the array of tweet objects.
        {

            for(let i=0; i<jsonData.length; ++i)
            {
                sb1.appendLine(`TWEET ${i+1}: ${jsonData[i].text} | Created at: ${jsonData[i].created_at}`);
            } 
            break;
        }
        case "get_all_userID": //Outputs all userID's by looping through the array of tweet objects
        {
            for(let i=0; i<jsonData.length; ++i)
            {
                sb1.append(`User ${i+1}: `).appendLine(jsonData[i].user.id);
            }
            break;
        }
        case "get_details": //Retrieres the text and creation time of the tweet with given ID.
        {
            //Read in the tweet ID recieved from the HTML form.
            let targetID = req.body.tweet_ID;

            //Make sure the received ID is not empty.
            if (targetID == "")
            {
                sb1.append("Invalid Entry");
            }
            else
            {
                //Check if there is a tweet with the given ID 
                //by iterating through the array of tweet objects and comparing the ID field with the target ID.
                let i = 0;
                while (i<jsonData.length)
                {
                    if (jsonData[i].id_str == targetID)
                    {
                        break;
                    }
                    ++i;
                }

                //Determine whether the index of the tweet with the given ID was found.
                if (i == jsonData.length)
                {
                    sb1.append(`The tweet with ID:${targetID} was not found :(`);
                }
                else
                {
                    sb1.append(`The following tweet with ID:${targetID} was found:\n${jsonData[i].text} | Created at: ${jsonData[i].created_at}`);
                }
            }
            break;
        }
        case "create_tweet": //Creates a new tweet and pushes it at the end of the array of tweet objects.
        {
            //Create a new tweet object with the fields used in this assignment.
            const newTweet = 
            {
                created_at: moment().format("ddd MMM D HH:mm:ss ZZ YYYY"),
                id: jsonData.length,
                id_str: jsonData.length.toString(),
                //Read in the tweet text recieved from the HTML form.
                text: req.body.tweet_text, 
                user:
                {
                    id: 12345,
                    name: "Alex",
                    screen_name: "alexsmkp"
                }          
            };
        
            //Push the new tweet object into the array of tweets.
            jsonData.push(newTweet);
            sb1.appendLine(`New tweet with ID: ${newTweet.id} was created:`)
            .append(`${newTweet.text} | Created at: ${newTweet.created_at} | by ${newTweet.user.name} (ID: ${newTweet.user.id})`);

            break;
        }
        case "update_name": //Changes the username in the tweet of the user with given name.
        {
            //Read in the name and the new username recieved from the HTML form.
            let targetName = req.body.name;
            let newScreenName = req.body.username;

            //Make sure the name or the new username is not empty.
            if (targetName == "" || newScreenName == "")
            {
                sb1.append("Invalid Entry");
            }
            else
            {
                let i = 0;
                let updated = false;
                let oldScreenName;
                
                //Iterate through the array of tweets and change every tweet where the name of the user matches the requested name.
                while (i<jsonData.length)
                {
                    if (jsonData[i].user.name == targetName)
                    {
                    oldScreenName = jsonData[i].user.screen_name;
                    jsonData[i].user.screen_name = newScreenName;
                    updated = true;
                    }
    
                    ++i;
                }
                
                //Check if there was a username change. If so, send the output to front-end.
                if (updated)
                {
                    sb1.append(`${targetName}'s username was changed from ${oldScreenName} to ${newScreenName}`);
                }
                else
                {
                   sb1.append(`The tweet with name: ${targetName} was not found :(`); 
                } 
            }  
            break; 
        }
        case "delete_tweet": //Delete the tweet with given ID.
        {
            //Read in the tweet ID recieved from the HTML form.
            let targetID = req.body.tweet_ID;

            //Make sure the input was not empty.
            if (targetID == "")
            {
                sb1.append("Invalid Entry");
            }
            else
            {
                let i = 0;

                //Check if there is a tweet with the given ID 
                //by iterating through the array of tweet objects and comparing the ID field with the target ID.
                while (i<jsonData.length)
                {
                    if (jsonData[i].id_str == targetID)
                    {
                        break;
                    }
                    ++i;
                }

                //Determine whether a tweet with the given ID was found.
                if (i == jsonData.length)
                {
                    sb1.append(`The tweet with ID:${targetID} was not found :(`);
                }
                else
                {
                    //If so, remove the tweet from the array of tweets.
                    jsonData.splice(i,1);
                    sb1.append(`The following tweet with ID:${targetID} was deleted`);
                }
            }
            break;
        }
    }

    passedData = sb1.toString();
    updateTwitter();
    //Rednder the page and pass the updated string.
    res.render('index',{passedData, twitterList,fileName});
    //Reset the output string.
    passedData = '';
});

//Launch server.
app.listen(port, ()=>
{
    console.log(`Listening on port ${port}`);
});
