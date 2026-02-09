import express from "express";
import {
    getPortals,
    getFeatures,
    calculateTotalPrice,
    getBundleDiscounts,
    getPricingPageData,
} from "../controllers/pricingController";

const router = express.Router();

// All pricing routes are public (no auth required)
router.get("/portals", getPortals);
router.get("/features", getFeatures);
router.post("/calculate", calculateTotalPrice);
router.get("/discounts", getBundleDiscounts);
router.get("/all", getPricingPageData);

export default router;
