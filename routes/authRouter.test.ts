import app from "../index";
import authController from "../controllers/authController.js";
import validateBody from "../middleware/validateBody.js";
import { authenticate } from "../middleware/autenticate.js";

jest.mock("../middleware/validateBody.js");
jest.mock("../middleware/autenticate.js");
jest.mock("../controllers/authController.js");

