import express, { request, Request, response, Response } from "express"; //การนำ express มาใช้ โดยการนำจากภายนอก
import { Pool } from "pg";
import jsonIm from "./user.json";
const app = express();
const port = 3000;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", // Replace 'name_of_db' with the actual name of your PostgreSQL database
  password: "12345", // Replace 'your_password' with the password for your PostgreSQL user
  port: 5432, // The default port for PostgreSQL is 5432
});

app.use(express.json());

app.get("/users", async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json({ data: users, meta: { length: users?.length } });
});

// app.get("/userName", async (req: Request, res: Response) => {
//   const userName = await getUserName();
//   res.json(userName);
// });

app.post("/users", async (req: Request, res: Response) => {
  console.log(req.body.userid);
  console.log(req.body.username);
  console.log(req.body.firstname);
  console.log(req.body.lastname);
  console.log(req.body.age);
  const userTest = req.body;

  const users = await addUser(
    userTest.username,
    userTest.firstname,
    userTest.lastname,
    userTest.age
  );
  res.json(users);
});

app.patch("/users/:userid", async (req: Request, res: Response) => {
  const updateUserTest = req.body;
  const updateUserId = req.params;
  const updateUser = await updateFirstnameLastname(
    updateUserId.userid,
    updateUserTest.username,
    updateUserTest.firstname,
    updateUserTest.lastname,
    updateUserTest.age
  );
  console.log(req.params.userid);
  console.log(updateUserTest.userid);
  res.json(updateUser);
});
app.listen(port, logport);

// app.get("/Testparams/:userid", (req: Request, res: Response) => {
//   const Testparams = req.params;
//   console.log(Testparams.userid);
// });

app.delete("/users/:userid", async (req: Request, res: Response) => {
  const userById = req.params;
  const deleteUserById = await deleteUserId(userById.userid);
  console.log(req.params.userid);
  res.json(deleteUserById);
});

// app.get("/users/:userid", async (req: Request, res: Response) => {
//   const getUserIdByParams = req.params;
//   const getUserById = await getUserId(getUserIdByParams.userid);
//   console.log(req.params.userid);
//   res.json({ data: getUserById, meta: { length: getUserById?.length } });
// });

// app.get("/users", async (req: Request, res: Response) => {
//   const getCountUserAll = (await getCountUser()) + getLimitUser();
//   console.log(getCountUserAll);
//   res.json({
//     data: getCountUserAll.getLimitUser,
//     meta: { page: 1, length: 10, total: getCountUserAll.getCountUser },
//   });
// });

app.get("/users", async (req: Request, res: Response) => {
  // const page = req.query.page;
  // const limit = req.query.limit;
  // const offset = (page - 1) * limit;

  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page - 1) * limit;

  console.log(offset);

  const getResultCount = await getCountUser();
  const getResultLimit = await getLimitUser(limit, offset);
  res.json({
    data: getResultLimit,
    meta: {
      page: page,
      length: getResultLimit?.length,
      total: getResultCount,
    },
  });
});

// const car: { type: string, model: string, year: number } = {
//   type: "Toyota",
//   model: "Corolla",
//   year: 2009
// };

function logport(): void {
  console.log(`App listening at http:\\localhost:${port}`);
}

async function getUsers() {
  try {
    const res = await pool.query('select * from "users"');
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function getUserName() {
  try {
    const res = await pool.query('select "firstname","lastname" from "users"');
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function addUser(
  username: string,
  firstname: string,
  lastname: string,
  age: number
) {
  try {
    const res = await pool.query(
      `insert into "users" (username, firstname, lastname ,age) values ('${username}','${firstname}','${lastname}','${age}')`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

//how can update just some data
async function updateFirstnameLastname(
  userid: string,
  username: string,
  firstname: string,
  lastname: string,
  age: number
) {
  try {
    const arrayvalue: string[] = [];
    if (username != undefined) {
      arrayvalue.push(`username = '${username}'`);
    }
    if (firstname != undefined) {
      arrayvalue.push(`firstname = '${firstname}'`);
    }
    if (lastname != undefined) {
      arrayvalue.push(`lastname = '${lastname}'`);
    }
    if (age != undefined) {
      arrayvalue.push(`age = '${age}'`);
    }
    console.log(arrayvalue);
    const res = await pool.query(
      `update "users" set ${arrayvalue.toString()} where userid = '${userid}';`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function deleteUserId(userid: string) {
  try {
    const res = await pool.query(
      `DELETE FROM "users"  WHERE userid ='${userid}'`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function getUserId(userid: string) {
  try {
    const res = await pool.query(
      `SELECT * FROM "users" WHERE userid = '${userid}';`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

// const getuserid = await pisma.user.findmany({
//   where: {userid:userid},
//   select: {
//     username: true,
//     firstname: true,
//     lastname: true,
//     age: true,
//   },
// })

// update "User" set username ='mairu',firstname = 'poke',lastname ='lee',age =75 where userid = 3;

// async function getCountUser() {
//   try {
//     const [countResult, userLimit] = await Promise.all([
//       pool.query(`SELECT COUNT(*) from users`),
//       pool.query(`SELECT * FROM users LIMIT 10`),
//     ]);
//     console.log("✅ Connected! Result:", countResult.rows);
//     console.log("✅ Connected! Result:", userLimit.rows);
//     return countResult.rows, userLimit.rows;
//   } catch (err) {
//     console.error("❌ Connection failed:", err);
//   }
// }

async function getCountUser() {
  try {
    const res = await pool.query("SELECT COUNT(*) from users");
    console.log("✅ Connected! Result:", res.rows[0].count);
    return res.rows[0].count;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}
async function getLimitUser(limit: number, offset: number) {
  try {
    const res = await pool.query(
      `SELECT * FROM users limit ${limit} offset ${offset} ;`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

//`SELECT * FROM users limit "${limit}" offset "${offset}"`

// select id,title from post where publishied = true

//product CRUD

app.get("/product", async (req: Request, res: Response) => {
  // const page = req.query.page;
  // const limit = req.query.limit;
  // const offset = (page - 1) * limit;

  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page - 1) * limit;

  console.log(offset);

  const getResultCount = await getCountProduct();
  const getResultLimit = await getLimitProduct(limit, offset);
  res.json({
    data: getResultLimit,
    meta: {
      page: page,
      length: getResultLimit?.length,
      total: getResultCount,
    },
  });
});

app.post("/product", async (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.body.productname);
  console.log(req.body.price);
  console.log(req.body.createddate);
  console.log(req.body.createdby);
  const productCreatTest = req.body;

  const productAdd = await addProduct(
    productCreatTest.productname,
    productCreatTest.price,
    productCreatTest.createddate,
    productCreatTest.createdby
  );
  res.json(productAdd);
});

//product CRUD funtion

async function getProduct() {
  try {
    const res = await pool.query("select * from product");
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function addProduct(
  productname: string,
  price: number,
  createddate: Date,
  createdby: string
) {
  try {
    const res = await pool.query(
      `insert into product (productname, price, createddate ,createdby) values ('${productname}','${price}','${createddate}','${createdby}')`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function getCountProduct() {
  try {
    const res = await pool.query("SELECT COUNT(*) from product");
    console.log("✅ Connected! Result:", res.rows[0].count);
    return res.rows[0].count;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

async function getLimitProduct(limit: number, offset: number) {
  try {
    const res = await pool.query(
      `SELECT * FROM product limit ${limit} offset ${offset} ;`
    );
    console.log("✅ Connected! Result:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}
// async function getLimitProduct(limit: number, offset: number) {
//   try {
//     const res = await pool.query(
//       `SELECT * FROM product limit ${limit} offset ${offset} ;`
//     );
//     console.log("✅ Connected! Result:", res.rows);
//     return res.rows;
//   } catch (err) {
//     console.error("❌ Connection failed:", err);
//   }
// }

// fffs
