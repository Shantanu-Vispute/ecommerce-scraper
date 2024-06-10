"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const executablePath = await chromium.executablePath();

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    return browser;
  } else {
    const browser = await puppeteer.launch();
    return browser;
  }
}

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // const options = {
  //   proxy: {
  //     host: "proxy-server.scraperapi.com",
  //     port: 8001,
  //     auth: {
  //       username: "scraperapi.device_type=desktop",
  //       password: "",
  //     },
  //     protocol: "http",
  //   },
  // };

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const content = await page.content();

    await browser.close();

    const $ = cheerio.load(content);

    // Fetch the product page
    // const response = await axios.get(url);

    // console.log("data ==> ", response.data);

    // const $ = cheerio.load(response.data);

    // Extract the product title
    const title =
      $("#productTitle").text().trim() ||
      $(".VU-ZEz").text().trim() ||
      $("span.sc-eDvSVe.fhfLdV").text().trim();

    let currentPrice;
    let originalPrice;
    let outOfStock;
    let images;
    let imageUrls: any[] = [];
    let currency;
    let discountRate;
    let stars;
    let reviewsCount: any;
    let description;

    if (url.includes("amazon")) {
      currentPrice = extractPrice(
        $(".priceToPay span.a-price-whole"),
        $(".a.size.base.a-color-price"),
        $(".a-button-selected .a-color-base")
      );
      originalPrice = extractPrice(
        $("#priceblock_ourprice"),
        $(".a-price.a-text-price span.a-offscreen"),
        $("#listPrice"),
        $("#priceblock_dealprice"),
        $(".a-size-base.a-color-price")
      );

      outOfStock =
        $("#availability span").text().trim().toLowerCase() ===
        "currently unavailable";

      images =
        $("#imgBlkFront").attr("data-a-dynamic-image") ||
        $("#landingImage").attr("data-a-dynamic-image") ||
        "{}";

      imageUrls = Object.keys(JSON.parse(images));

      currency = extractCurrency($(".a-price-symbol"));
      discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

      stars = $("#acrPopover").attr("title")?.split(" ")[0];

      reviewsCount = $("#acrCustomerReviewText")
        .text()
        .split(" ")[0]
        .replace(/,/g, "");

      description = extractDescription($);
    } else {
      currency = "₹";

      currentPrice = $(".Nx9bqj.CxhGGd")
        .text()
        .trim()
        .replace(/[^0-9.]/g, "");

      originalPrice = $(".UOCQB1 .hl05eU .yRaY8j")
        .text()
        .trim()
        .replace(/[^0-9.]/g, "");

      outOfStock =
        $(".Z8JjpR").text().trim().toLowerCase() === "coming soon" ||
        $(".Z8JjpR").text().trim().toLowerCase() === "sold out" ||
        $(".Z8JjpR").text().trim().toLowerCase() === "temporarily unavailable";

      images =
        $(".DByuf4.IZexXJ.jLEJ7H").attr("src") ||
        $("._53J4C-.utBuJY").attr("src");

      imageUrls = [images];

      stars = $("._5OesEi.HDvrBb span div.XQDdHH").text().trim();

      reviewsCount =
        $("._5OesEi.HDvrBb span.Wphh3N span span")
          .text()
          .trim()
          .split(" ")[0]
          .replace(/[^0-9]/g, "") ||
        $("._5OesEi.HDvrBb.VWRXZO span.Wphh3N span")
          .text()
          .trim()
          .split(" ")[0]
          .replace(/[^0-9]/g, "");

      discountRate = $(".UOCQB1 .hl05eU .UkUFwK")
        .text()
        .trim()
        .replace(/[^0-9.]/g, "");

      description = title;
    }

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      stars: stars || "0",
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: Number(reviewsCount) || 0,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    console.log(error);
  }
}
