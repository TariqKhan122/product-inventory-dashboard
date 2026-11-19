# Product Inventory Dashboard

A product dashboard with full create, read, update and delete (CRUD) powered by a REST API. Browse the inventory, search, filter and sort it, and manage products with proper loading, error and empty states.

## Features

- **View products** with a GET request, shown in a paginated list
- **Add a product** with POST
- **Edit a product** with PUT (full update) or PATCH (partial update)
- **Delete a product** with DELETE
- **Search, filter and sort** the product list
- **Pagination** for working through large inventories
- **Loading, error and empty states** so the UI always shows what is happening
- **Retry on failure** when a request goes wrong
- **Request cancellation** with `AbortController`, so outdated requests never overwrite newer results
- **Typed API responses** so data from the API is checked at compile time

## HTTP methods used

| Method | Purpose |
|--------|---------|
| `GET` | Fetch the list of products |
| `POST` | Create a new product |
| `PUT` | Replace a product with updated data |
| `PATCH` | Update only selected fields of a product |
| `DELETE` | Remove a product |

## Tech stack

- Frontend: **[React, TypeScript, Vite: edit to match your project]**
- Data: **[name of the REST API or mock server you used]**
- Networking: Fetch API with `async/await`

## Getting started

Make sure [Node.js](https://nodejs.org) (LTS) is installed, then:

```bash
git clone https://github.com/TariqKhan122/product-inventory-dashboard.git
cd product-inventory-dashboard
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

## What this project demonstrates

- REST API basics and HTTP methods
- Fetch API with `async/await`
- GET, POST, PUT, PATCH and DELETE requests
- Handling loading, error and empty states
- Handling API failures and retrying
- Search, filtering and sorting
- Pagination
- Typing API responses
- Cancelling old requests with `AbortController`

## Author

Built by [Hafiz M Tariq](https://github.com/TariqKhan122).
