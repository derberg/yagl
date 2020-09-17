const { graphql } = require('@octokit/graphql');

module.exports = {
  getOrgRepos,
  createLabel
};

async function getOrgRepos() {
  return await graphql(
    `
         query getRepos($login: String!) { 
            organization(login: $login){
              repositories(first:100){
                nodes{
                  id, name
                }
              }
            }
          }
        `,
    {
      login: process.env.ORG_NAME,
      headers: {
        //below media header is needed to enable labels creation that are in preview atm
        accept: 'application/vnd.github.bane-preview+json',
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
}

async function createLabel(repoId, repoName) {
  try {
    await graphql(
      `
                 mutation createLabes($color: String!, $name: String!, $description: String, $repositoryId: ID!) { 
                    createLabel( input: { color: $color, name: $name, repositoryId: $repositoryId, description: $description } ){
                      label {
                        id, name
                      }
                    }
                  }
                `,
      {
        color: process.env.COLOR || 'FF8AE2',
        name: process.env.LABEL || 'Hacktoberfest',
        description: process.env.DESCRIPTION || 'Label issues as available for participants of https://hacktoberfest.digitalocean.com',
        repositoryId: repoId,
        headers: {
          //below media header is needed to enable labels creation that are in preview atm
          accept: 'application/vnd.github.bane-preview+json',
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    console.log(`Label created successfully in ${repoName} repository`);  
  } catch (error) {
    console.error(`Desired label already exists in ${repoName} repository`);  
  }
}