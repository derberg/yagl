const { getOrgRepos, createLabel } = require('./graphql');

(async () => {
  try {
    const { organization: org } = await getOrgRepos();

    for (const { id, name } of org.repositories.nodes) {
      await createLabel(id, name);
    }
  } catch (e) {
    const errors = e.errors;
    console.error(errors ? errors : e.message);
  }
})();

