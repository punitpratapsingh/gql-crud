const fetch = require("node-fetch")

const HASURA_OPERATION = `
mutation ($id: Int, $name: String,$email: String) {
  update_users(where: {id: {_eq: $id}}, _set: {name: $name, email: $email}) {
    affected_rows
    returning {
      id
      name
      email
    }
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
app.post('/UpdateUsersDerived', async (req, res) => {

  // get request input
  const { id, name, email } = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ id, name, email });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    ...data.update_users
  })

});

/*
mutation ($id: Int, $name: String,$email: String) {
  update_users(where: {id: {_eq: $id}}, _set: {name: $name, email: $email}) {
    affected_rows
    returning {
      id
      name
      email
    }
  }
}
*/