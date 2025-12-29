import app from "./app";

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/stream?q=Check stock for organic soap`);
});