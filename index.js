const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");

/*
* At least one badge
* Project title
* Description
* Table of Contents
* Installation
* Usage
* License
* Contributing
* Tests
* Questions
  * User GitHub profile picture
  * User GitHub email
*/


async function queryGitHub(username) {
    const queryUrl = `https://api.github.com/users/${username}`;
    this.response;
    const gitHubResponse = await axios.get(queryUrl);
    return gitHubResponse;
}

function writeToFile(answers) {
    let template = stripIndent`# ${answers.title}
    Authored by ${answers.username} ( ${answers.email} ) <br>
    ![Profile Picture]( ${answers.profileImageURL} "Profile Pic")
    
    ### Description
    ${answers.description}
        
    ### Table of Contents
        
    * Installation
    * Usage
    * License
    * Contributing
    * Tests

    ### Installation
    ${answers.install}

    ### Usage
    ${answers.usage}

    ### License
    ${answers.licensing}

    ### Contributing
    ${answers.contribute}

    ### Tests
    ${answers.testing}
`

    fs.writeFile("./output/README.md", template, (err) => {
        return (err) ? ("Error:", err) : "Readme generated";
    });
}

async function askQuestions() {
    const questions = {
        'username': "Please enter your github username",
        'email' : "Please enter your email address",
        'title': "Please enter a project title",
        'description': "Please enter a project description",
        'install': "Please enter a comment about installation",
        'usage': "Please enter a comment about usage",
        'licensing': "Please enter a comment about licensing",
        'contribute': "Please enter a comment about contributing to this project",
        'testing': "Please enter a comment about testing"
    };

    let answers = {};

    for (var question in questions) {
        const input = await inquirer.prompt({
                type: "input",
                message: questions[question],
                name: question
        });

        answers[question] = input[question];
    }
    return answers;
}

async function init() {
    let answers = await askQuestions();
    let gitHubData = await queryGitHub(answers.username);
    answers["profileImageURL"] = gitHubData.data.avatar_url;
    console.log(writeToFile(answers));
}

init();
