# Twitter JSON - Assignment 1
<p>Project: Spring22 CS3203 Assignment 1</p>
<p>Author: Aleksandr Semikopenko</p>

<p>This program retrieves information from a given JSON file with Twitter data and performs various tasks such as displaying and updating certain parameters of the tweets as well as creating and deleting an entrire tweet.</p>

## How to run?

#### Install Node.js

#### Install all dependencies
    npm install
#### Run the server
<p>Type the following command in the terminal</p>
    node index.js
<p>You can also install nodemon to run a server that automatically restarts every time a change is made </p>
    npm install -g nodemon 
<p>To run the server with Nodemon:</p>
    nodemon index.js

## How to use?

<p>The UI consists of 6 available functions on the left, the current tweets list on the right and the display console at the bottom of the page.</p>

<p>The program is able to perform the following fucntions:</p>

#### 1. Get All Tweets
<p>To display the text and the creation time of >all tweets, click the Get button in front of the >"Get All Tweets" label.</p>
    
#### 2. Get All User ID's
<p>To display the user ID's of all the tweets, > click the Get button in front of the "Get All > > User ID's" label.</p>
    
#### 3. Retrieve tweet details
<p>To retrieve a tweet with given ID, type in > > the desired tweet ID in the input field in > > > front of the "Retrieve tweet details" label and > click the Get button. The console will display > the text and the creation time of the tweet.</p>
    
#### 4. Create a new tweet
<p>To create a new tweet, type in the tweet in > the input field in front of the "Create a new > > tweet" label and click the Tweet! button. The > > new tweet will be added to the current list of > tweets.</p>
    
#### 5. Update username
<p>To change the username in a tweet with a > > > given user's name, type in the user's name and > the new username in front of the "Update > > > > username" label and click Change button.</p>

#### 6. Delete a tweet
<p>To delete a tweet with a given ID, enter the ID > in the field in front of the "Delete a tweet" > > label.</p>

#### Clear console    
<p>To clear the console, click Clear Console.</p>

#### Load file
<p>To load a file, click the "Choose File" button and choose a desired .json files from the project direcotry. Then click "Load".</p>

#### Save file
<p>To save the current Tweet list to a new file, type in the file name without extension and click save. The file will appear in the root directory of the project.</p>

