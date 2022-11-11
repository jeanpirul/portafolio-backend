import express from "express";

const router = express.Router();

// ACTION: CONNECT
// METHOD: GET
router.get("/", (req, res) => {
  res.status(200).send("Se ha conectado correctamente.");
});

// ACTION: GET USER
// METHOD: GET
router.get("/root/user", (req, res) => {
  res.status(200).send([
    {
      id: "1",
      name: "Jean",
      lastName: "Pirul",
    },
    {
      id: "2",
      name: "Cri",
      lastName: "xikito",
    },
  ]);
});

export default router;
