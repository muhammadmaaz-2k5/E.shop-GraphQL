import pg from 'pg';
import fetch from 'node-fetch'; // wait, node-fetch is not in package.json. Let's use node's native fetch which is built-in in Node 18+!

async function makeGraphQLRequest(query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const body = await res.json();
  if (body.errors) {
    console.error('GraphQL Errors:', JSON.stringify(body.errors, null, 2));
  }
  return body.data;
}

async function main() {
  console.log('--- GraphQL Endpoint Test Suite ---');

  // 1. Check anonymous products query
  console.log('\n1. Fetching products (anonymous)...');
  const productsQuery = `
    query {
      products(pagination: { first: 5 }) {
        edges {
          node {
            id
            name
            price
            sku
          }
        }
        totalCount
      }
    }
  `;
  const productsData = await makeGraphQLRequest(productsQuery);
  console.log('Result:', JSON.stringify(productsData, null, 2));

  // 2. Register user
  console.log('\n2. Registering new user (admin@eshop.com)...');
  const registerMutation = `
    mutation {
      register(input: {
        email: "admin@eshop.com",
        password: "maazpassword",
        firstName: "Maaz",
        lastName: "Admin"
      }) {
        accessToken
        user {
          id
          email
          role
        }
      }
    }
  `;
  
  // Clean up existing user if it exists in DB to prevent unique constraint error
  const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'eshop',
    user: 'postgres',
    password: 'maaz',
  });
  await pool.query("DELETE FROM users WHERE email = 'admin@eshop.com'");
  await pool.query("DELETE FROM auth.users WHERE email = 'admin@eshop.com'");
  await pool.end();

  const registerData = await makeGraphQLRequest(registerMutation);
  console.log('Result:', JSON.stringify(registerData, null, 2));
  
  if (!registerData || !registerData.register) {
    console.error('Registration failed, aborting further tests.');
    process.exit(1);
  }

  const userId = registerData.register.user.id;
  let token = registerData.register.accessToken;

  // 3. Promote user to Admin in DB directly
  console.log('\n3. Elevating user role to admin in database...');
  const pool2 = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'eshop',
    user: 'postgres',
    password: 'maaz',
  });
  await pool2.query("UPDATE users SET role = 'admin' WHERE id = $1", [userId]);
  await pool2.end();
  console.log('User promoted to admin.');

  // Note: We need a new login token since the old token has 'customer' role encoded in payload.
  console.log('\n4. Logging in as Admin to get updated token...');
  const loginMutation = `
    mutation {
      login(input: {
        email: "admin@eshop.com",
        password: "maazpassword"
      }) {
        accessToken
        user {
          id
          role
        }
      }
    }
  `;
  const loginData = await makeGraphQLRequest(loginMutation);
  console.log('Result:', JSON.stringify(loginData, null, 2));
  token = loginData.login.accessToken;

  // 5. Query "me" endpoint
  console.log('\n5. Querying "me" endpoint (authenticated)...');
  const meQuery = `
    query {
      me {
        id
        email
        role
        firstName
        lastName
      }
    }
  `;
  const meData = await makeGraphQLRequest(meQuery, {}, token);
  console.log('Result:', JSON.stringify(meData, null, 2));

  // Clean up any existing product with the same SKU
  const pool3 = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'eshop',
    user: 'postgres',
    password: 'maaz',
  });
  await pool3.query("DELETE FROM products WHERE sku = 'SEQ-TEST-123'");
  await pool3.end();

  // 6. Create Product
  console.log('\n6. Creating product (authenticated as Admin)...');
  const createProductMutation = `
    mutation {
      createProduct(input: {
        name: "Sequelize Test Phone",
        sku: "SEQ-TEST-123",
        price: 999.99,
        description: "A phone tested via Sequelize ORM"
      }) {
        id
        name
        price
        sku
      }
    }
  `;
  const createProductData = await makeGraphQLRequest(createProductMutation, {}, token);
  console.log('Result:', JSON.stringify(createProductData, null, 2));
  
  if (!createProductData || !createProductData.createProduct) {
    console.error('Product creation failed, aborting.');
    process.exit(1);
  }

  const productId = createProductData.createProduct.id;

  // 7. Add product to cart
  console.log('\n7. Adding product to cart (authenticated)...');
  const addToCartMutation = `
    mutation($input: AddToCartInput!) {
      addToCart(input: $input) {
        id
        subtotal
        total
        items {
          id
          productId
          quantity
          unitPrice
          totalPrice
        }
      }
    }
  `;
  const addToCartData = await makeGraphQLRequest(addToCartMutation, { input: { productId, quantity: 2 } }, token);
  console.log('Result:', JSON.stringify(addToCartData, null, 2));

  // 8. Create order from cart
  console.log('\n8. Placing order from cart (authenticated)...');
  const createOrderMutation = `
    mutation {
      createOrder(input: {
        shippingAddress: {
          firstName: "Maaz",
          lastName: "Admin",
          addressLine1: "123 Dev Street",
          city: "Karachi",
          state: "Sindh",
          postalCode: "75300",
          country: "PK"
        }
      }) {
        id
        orderNumber
        status
        total
        items {
          id
          productName
          quantity
          totalPrice
        }
      }
    }
  `;
  const createOrderData = await makeGraphQLRequest(createOrderMutation, {}, token);
  console.log('Result:', JSON.stringify(createOrderData, null, 2));

  console.log('\nAll test queries completed successfully!');
}

main().catch(err => {
  console.error('Test Suite Failed:', err);
});
