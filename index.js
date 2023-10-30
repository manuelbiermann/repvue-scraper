#!/usr/bin/env node
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
require("dotenv").config();
const Sheet = require("./sheet");
const axios = require("axios");
const HttpsProxyAgent = require("https-proxy-agent");
const cheerio = require("cheerio");

// GoogleSheet Template: https://docs.google.com/spreadsheets/d/1IfIWTVT8UKNAIxwwbQm3qfxKXmz3Hw1WNrMiDXZ6eCk/edit#gid=0

let baseurl = `https://repvue-api.herokuapp.com/api/companies?page=`;

const proxyServer = process.env.BRIGHTDATA_PROXY_SERVER;
const proxyUser = process.env.BRIGHTDATA_PROXY_USER;
const proxyPass = process.env.BRIGHTDATA_PROXY_PASSWORD;
const proxyCountryCode = "";

function timeout(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const getListings = async (url, sheet) => {
  try {
    console.log("Going to url: ", url);
    const axiosResponse = await axios.get(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
      },
      proxy: false,
      // Currently not working woth Brightdata because they block the LinkedIn URL
      // httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(
      //   `http://${proxyUser}${proxyCountryCode}:${proxyPass}@${proxyServer}`
      // ),
    });

    const response = await axiosResponse.data;
    // const date_scraped = new Date();
    console.log(response);

    let companies = response.companies;
    await sheet.addRows(0, companies);

    timeout(3000 + Math.floor(Math.random() * 2000));
    return companies;
  } catch (error) {
    console.log(error, error.message);
  }
};

(async function () {
  const sheet = new Sheet();
  await sheet.load();

  // const data = await sheet.getRowsBySheetsTitle(campaign_details.tab_name);
  // const Company_Links = data.map((e) => {
  //   if (e.campaign_name === campaign_details.campaign_name) {
  //     return e.Company_Link;
  //   } else {
  //     return null;
  //   }
  // });

  // console.log(Company_Links);
  // const uniqueCompany_Links = new Set(Company_Links.filter((e) => !!e));
  // console.log(uniqueCompany_Links);

  // Load the current sheet and load listings
  // Add filter to only add new listings to sheet

  for (let pageNumber = 2; pageNumber < 178; pageNumber += 1) {
    let url = `${baseurl}${pageNumber}`;
    let companies = await getListings(url, sheet);
    console.log(companies);
  }
})();
