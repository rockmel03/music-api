const allowedOrigin = ["http://localhost:8080", "http://localhost:5173"];

export const corsOptions = {
  origin: (origin, callback) => {
    console.log("cors origin : ", origin);
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Invalid origin"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
