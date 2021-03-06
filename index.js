const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);
const promptUser = () => {
  return inquirer.prompt([
    {
      message: "What is your github username?",
      name: "name"
    },
    {
      message: "What is your project's name?",
      name: "projectname"
    },
    {
      message: "Please write a short description of your project",
      name: "description"
    },
    {
      message: "What kind of license should your project have?",
      name: "license"
    },
    {
      message: "What command should be run to run tests?",
      name: "tests"
    }
  ]);
};
const getUserName = answers => {
  const queryUrl = `https://api.github.com/users/${answers.name}`;
  return axios.get(queryUrl).then(function(result) {
    const resultData = result.data;
    return resultData;
  });
};
const generateHTML = (answers, image) => {
  return `
    # ${answers.projectname} 
    [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
    ## Description
${answers.description}

## Table of Contents
* [Installation](#Installation) 
* [Usage](#Usage) 
* [License](#License) 
* [Contributing](#Contributing) 
* [Tests](#Tests)
* [Questions](#Questions)
## Installation
To install necessary dependencies, run the following command.
    ${answers.dependencies}
## Usage
${answers.repotips}
## License
${answers.license}
## Contributing
${answers.repocontribute}
## Tests
To perform a test, run the following command:
    ${answers.tests}
    
## Questions

![Markdown Logo](${image.avatar_url})

Please feel free to contact ${answers.name} directly at ${image.blog}
`;
};
async function init() {
  try {
    const answers = await promptUser();
    const image = await getUserName(answers);
    const readMe = generateHTML(answers, image);
    await writeFileAsync("README.md", readMe);
    console.log("Successful README.md");
  } catch (err) {
    console.log(err);
  }
}

init();
