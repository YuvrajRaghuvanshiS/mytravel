import app from "./app.js";
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Customer backend running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from customer backend");
});
