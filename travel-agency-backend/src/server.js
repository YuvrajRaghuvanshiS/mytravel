import app from "./app.js";

const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`Travel Agency backend running on port ${PORT}`)
);

app.get("/", (req, res) => {
  res.send("Hello from travel agency backend");
});
