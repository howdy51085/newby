"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //การนำ express มาใช้ โดยการนำจากภายนอก
const pg_1 = require("pg");
const app = (0, express_1.default)();
const port = 3000;
const pool = new pg_1.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", // Replace 'name_of_db' with the actual name of your PostgreSQL database
  password: "12345", // Replace 'your_password' with the password for your PostgreSQL user
  port: 5432, // The default port for PostgreSQL is 5432
});
app.use(express_1.default.json());
app.get("/users", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getUsers();
    res.json({
      data: users,
      meta: {
        length: users === null || users === void 0 ? void 0 : users.length,
      },
    });
  })
);
// app.get("/userName", async (req: Request, res: Response) => {
//   const userName = await getUserName();
//   res.json(userName);
// });
app.post("/users", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.userid);
    console.log(req.body.username);
    console.log(req.body.firstname);
    console.log(req.body.lastname);
    console.log(req.body.age);
    const userTest = req.body;
    const users = yield addUser(
      userTest.username,
      userTest.firstname,
      userTest.lastname,
      userTest.age
    );
    res.json(users);
  })
);
app.patch("/users/:userid", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const updateUserTest = req.body;
    const updateUserId = req.params;
    const updateUser = yield updateFirstnameLastname(
      updateUserId.userid,
      updateUserTest.username,
      updateUserTest.firstname,
      updateUserTest.lastname,
      updateUserTest.age
    );
    console.log(req.params.userid);
    console.log(updateUserTest.userid);
    res.json(updateUser);
  })
);
app.listen(port, logport);
// app.get("/Testparams/:userid", (req: Request, res: Response) => {
//   const Testparams = req.params;
//   console.log(Testparams.userid);
// });
app.delete("/users/:userid", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userById = req.params;
    const deleteUserById = yield deleteUserId(userById.userid);
    console.log(req.params.userid);
    res.json(deleteUserById);
  })
);
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
app.get("/users", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // const page = req.query.page;
    // const limit = req.query.limit;
    // const offset = (page - 1) * limit;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    console.log(offset);
    const getResultCount = yield getCountUser();
    const getResultLimit = yield getLimitUser(limit, offset);
    res.json({
      data: getResultLimit,
      meta: {
        page: page,
        length:
          getResultLimit === null || getResultLimit === void 0
            ? void 0
            : getResultLimit.length,
        total: getResultCount,
      },
    });
  })
);
// const car: { type: string, model: string, year: number } = {
//   type: "Toyota",
//   model: "Corolla",
//   year: 2009
// };
function logport() {
  console.log(`App listening at http:\\localhost:${port}`);
}
function getUsers() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query('select * from "users"');
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function getUserName() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        'select "firstname","lastname" from "users"'
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function addUser(username, firstname, lastname, age) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        `insert into "users" (username, firstname, lastname ,age) values ('${username}','${firstname}','${lastname}','${age}')`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
//how can update just some data
function updateFirstnameLastname(userid, username, firstname, lastname, age) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const arrayvalue = [];
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
      const res = yield pool.query(
        `update "users" set ${arrayvalue.toString()} where userid = '${userid}';`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function deleteUserId(userid) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        `DELETE FROM "users"  WHERE userid ='${userid}'`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function getUserId(userid) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        `SELECT * FROM "users" WHERE userid = '${userid}';`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
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
function getCountUser() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query("SELECT COUNT(*) from users");
      console.log("✅ Connected! Result:", res.rows[0].count);
      return res.rows[0].count;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function getLimitUser(limit, offset) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        `SELECT * FROM users limit ${limit} offset ${offset} ;`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
//`SELECT * FROM users limit "${limit}" offset "${offset}"`
// select id,title from post where publishied = true
//product CRUD
app.get("/product", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // const page = req.query.page;
    // const limit = req.query.limit;
    // const offset = (page - 1) * limit;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;
    console.log(offset);
    const getResultCount = yield getCountProduct();
    const getResultLimit = yield getLimitProduct(limit, offset);
    res.json({
      data: getResultLimit,
      meta: {
        page: page,
        length:
          getResultLimit === null || getResultLimit === void 0
            ? void 0
            : getResultLimit.length,
        total: getResultCount,
      },
    });
  })
);
app.post("/product", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    console.log(req.body.productname);
    console.log(req.body.price);
    console.log(req.body.createddate);
    console.log(req.body.createdby);
    const productCreatTest = req.body;
    const productAdd = yield addProduct(
      productCreatTest.productname,
      productCreatTest.price,
      productCreatTest.createddate,
      productCreatTest.createdby
    );
    res.json(productAdd);
  })
);
//product CRUD funtion
function getProduct() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query("select * from product");
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function addProduct(productname, price, createddate, createdby) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        `insert into product (productname, price, createddate ,createdby) values ('${productname}','${price}','${createddate}','${createdby}')`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function getCountProduct() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query("SELECT COUNT(*) from product");
      console.log("✅ Connected! Result:", res.rows[0].count);
      return res.rows[0].count;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}
function getLimitProduct(limit, offset) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield pool.query(
        `SELECT * FROM product limit ${limit} offset ${offset} ;`
      );
      console.log("✅ Connected! Result:", res.rows);
      return res.rows;
    } catch (err) {
      console.error("❌ Connection failed:", err);
    }
  });
}

// fdddadfdaff
