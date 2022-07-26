const fetch = require("node-fetch")

const HASURA_OPERATION = `
mutation ($name: String!, $email: String!) {
  insert_users_one(object: {
    name: $name,
    email: $email,
  }) {
    id
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "https://mighty-hyena-98.hasura.app/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: HASURA_OPERATION,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data);
  return data;
};
  

// Request Handler
app.post('/InsertUsersOneDerived', async (req, res) => {

  // get request input
  const { name, email } = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ name, email });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    ...data.insert_users_one
  })

});

/* 
mutation ($name: String!, $email: String!) {
  insert_users_one(object: {
    name: $name,
    email: $email,
  }) {
    id
  }
}
*/