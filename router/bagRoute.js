import express from 'express';
const router = express.Router();
import { CREATE_BAG, DELETE_BAG, GET_ALL_BAG, GET_BAG, UPDATE_BAG } from "../controller/bagControl.js"
import VERIFY_HEADER from "../utils/verifyHeader.js";
import { VERIFY_ADMIN, VERIFY_USER } from "../utils/verifySecrets.js";


// get all bag
// GET
router.get('/', VERIFY_HEADER, VERIFY_ADMIN, GET_ALL_BAG);

// get a user bag
// GET
router.get('/get/', VERIFY_HEADER, VERIFY_USER, GET_BAG);

// create a bag
// POST
router.post('/post/', VERIFY_USER, CREATE_BAG);

// update a bag
// PUT
router.put('/put/', VERIFY_USER, UPDATE_BAG);

// delete a bag
// DELETE
router.delete('/delete/', VERIFY_USER, DELETE_BAG);

export default router;