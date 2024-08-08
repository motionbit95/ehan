const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// 정적 파일 제공

app.use(express.static(path.join(__dirname, "build")));

// 모든 다른 라우트는 React 애플리케이션으로 리다이렉트
app.get("*", (req, res) => {
  let ogTags = `
  `;
  fs.readFile(
    path.join(__dirname, "build", "index.html"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).send("An error occurred");
      }
      return res.send(data.replace("<head>", `<head>${ogTags}`));
    }
  );
});

// 'about' 라우트는 정적 HTML 페이지를 제공
app.get("/bdsm", (req, res) => {
  let ogTags = `<title>BDSM 테스트</title>
    <meta name="description" content="너 SEX MBTI 뭐야? 나의 성적 성향을 알아보세요." />
    <meta property="og:title" content="BDSM 테스트" />
    <meta property="og:description" content="너 SEX MBTI 뭐야? 나의 성적 성향을 알아보세요." />
    <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/ehan-database.appspot.com/o/bdsm.png?alt=media&token=2351a0f7-bbbf-444b-8504-f49fc8022077" />
    <meta property="og:url" content="https://redswitch.kr/bdsm" />`;

  console.log(ogTags);
  fs.readFile(
    path.join(__dirname, "build", "bdsm.html"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).send("An error occurred");
      }
      return res.send(data.replace("<head>", `<head>${ogTags}`));
    }
  );
});

app.listen(3000, () => console.log("Server running on port 3000"));
