const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const dayjs = require("dayjs");

app.use(express.json());
app.use(cors());

const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use("/uploads", express.static("uploads"));

const { Client } = require("pg");

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

// [GET] 상품 목록 조회
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";

  client.query(sql, (err, result) => {
    result.rows.map((product, index) => {
      product.img_url = `http://localhost:8080/${product.img_url}`;
    });

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

// [GET] 상품 정보 조회
app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  const sql = `SELECT * FROM products WHERE id =${id}`;

  client.query(sql, (err, result) => {
    result.rows[0].img_url = `http://localhost:8080/${result.rows[0].img_url}`;

    if (err) {
      console.log(err.stack);
      res.sendStatus(500);
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});

// [GET] 배너 목록 조회
app.get("/banners", (req, res) => {
  const sql = "SELECT * FROM banners ORDER BY created_at DESC";

  client.query(sql, (err, result) => {
    result.rows.map((banner, index) => {
      banner.img_url = `http://localhost:8080/${banner.img_url}`;
    });

    if (err) {
      console.log(err.stack);
      res.sendStatus(500);
    } else {
      res.status(200).json({
        banners: result.rows,
      });
    }
  });
});

// [POST] 상품 업로드
app.post("/product", (req, res) => {
  console.log(req.body);
  const sql =
    "INSERT INTO products(name, price, seller, img_url, img_info, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
  const { name, price, seller, img_url, img_info } = req.body;

  const date = dayjs().format("YYYYMMDDHHmmss");
  client.query(
    sql,
    [name, price, seller, img_url, img_info, "01", date, date],
    (err, result) => {
      if (err) {
        console.log(err.stack);
        res.sendStatus(500);
      } else {
        res.status(200).send("상품이 등록되었습니다!");
      }
    }
  );
});

// [POST] 상품 업로드 - 이미지 업로드
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    img_url: file.path,
  });
});

app.listen(port, () => {
  console.log("server on ...");
});
