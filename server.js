const { Client } = require("pg");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

var client = new Client({
  user: "steady",
  host: "localhost",
  database: "express_study_db",
  password: "awds1329",
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error("db conn error!", err.stack);
  } else {
    console.log("db conn success!");
  }
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";

  client.query(sql, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(500);
    } else {
      res.status(200).json({
        products: result.rows,
      });
    }
  });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  const sql = `SELECT * FROM products WHERE id =${id}`;

  client.query(sql, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows);
    }
  });
});

app.post("/product", (req, res) => {
  console.log(req.body);
  const sql =
    "INSERT INTO products(name, price, seller, img_url, img_info) VALUES($1, $2, $3, $4, $5)";
  const { name, price, seller, img_url = "", img_info } = req.body;

  client.query(sql, [name, price, seller, img_url, img_info], (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(500);
    } else {
      res.status(200).send("상품이 등록되었습니다!");
    }
  });
});

app.listen(port, () => {
  console.log("server on ...");
});
