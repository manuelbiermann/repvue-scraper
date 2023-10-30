#!/usr/bin/env node
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
require("dotenv").config();
const Sheet = require("./sheet");
const axios = require("axios");
const HttpsProxyAgent = require("https-proxy-agent");
const cheerio = require("cheerio");

// GoogleSheet Template: https://docs.google.com/spreadsheets/d/1IfIWTVT8UKNAIxwwbQm3qfxKXmz3Hw1WNrMiDXZ6eCk/edit#gid=0

const proxyServer = process.env.BRIGHTDATA_PROXY_SERVER;
const proxyUser = process.env.BRIGHTDATA_PROXY_USER;
const proxyPass = process.env.BRIGHTDATA_PROXY_PASSWORD;
const proxyCountryCode = "";

const slugs = ["IQPC", "Databook", "ZiplyFiber", "Explorium", "wrk"];

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
      timeout: 5000,
      // Currently not working woth Brightdata because they block the LinkedIn URL
      // httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(
      //   `http://${proxyUser}${proxyCountryCode}:${proxyPass}@${proxyServer}`
      // ),
    });

    const response = await axiosResponse.data;
    // const date_scraped = new Date();
    console.log(response);

    let companyData = response.pageProps;

    let company = {
      id: companyData.company.id,
      slug: companyData.company.slug,
      average_rating: companyData.company.average_rating,
      careers_url: companyData.company.careers_url,
      industry: companyData.company.industry,
      quota_attainment: companyData.company.quota_attainment,
      ratings_count: companyData.company.ratings_count,
      current_employee_ratings_count:
        companyData.overview.current_employee_ratings_count,
      former_employee_ratings_count:
        companyData.overview.former_employee_ratings_count,
      repvue_score: companyData.company.repvue_score,
      top_percent: companyData.company.top_percent,
      verified_ratings_percent: companyData.company.verified_ratings_percent,
      website: companyData.company.website,
      funding_source: companyData.overview.funding_source,
      hq_location: companyData.overview.hq_location,
      global_average_quota_attainment:
        companyData.overview.global_average_quota_attainment,
      industry_average_quota_attainment:
        companyData.overview.industry_average_quota_attainment,
      industry_position: companyData.overview.industry_position,
      overall_position: companyData.overview.overall_position,
      size: companyData.overview.size,
      year_founded: companyData.overview.year_founded,
      salaries: JSON.stringify(companyData.salaries),
      culture_and_leadership_name:
        companyData.overview.current_company_metric_scores[0].name,
      culture_and_leadership_company_metric_percentile:
        companyData.overview.current_company_metric_scores[0]
          .company_metric_percentile,
      culture_and_leadership_industry_position:
        companyData.overview.current_company_metric_scores[0].industry_position,
      culture_and_leadership_overall_position:
        companyData.overview.current_company_metric_scores[0].overall_position,
      culture_and_leadership_raw_average:
        companyData.overview.current_company_metric_scores[0].raw_average,
      base_compensation_name:
        companyData.overview.current_company_metric_scores[1].name,
      base_compensation_company_metric_percentile:
        companyData.overview.current_company_metric_scores[1]
          .company_metric_percentile,
      base_compensation_industry_position:
        companyData.overview.current_company_metric_scores[1].industry_position,
      base_compensation_overall_position:
        companyData.overview.current_company_metric_scores[1].overall_position,
      base_compensation_raw_average:
        companyData.overview.current_company_metric_scores[1].raw_average,
      incentive_compensation_structure_name:
        companyData.overview.current_company_metric_scores[2].name,
      incentive_compensation_structure_company_metric_percentile:
        companyData.overview.current_company_metric_scores[2]
          .company_metric_percentile,
      incentive_compensation_structure_industry_position:
        companyData.overview.current_company_metric_scores[2].industry_position,
      incentive_compensation_structure_overall_position:
        companyData.overview.current_company_metric_scores[2].overall_position,
      incentive_compensation_structure_raw_average:
        companyData.overview.current_company_metric_scores[2].raw_average,
      product_market_fit_name:
        companyData.overview.current_company_metric_scores[3].name,
      product_market_fit_company_metric_percentile:
        companyData.overview.current_company_metric_scores[3]
          .company_metric_percentile,
      product_market_fit_industry_position:
        companyData.overview.current_company_metric_scores[3].industry_position,
      product_market_fit_overall_position:
        companyData.overview.current_company_metric_scores[3].overall_position,
      product_market_fit_raw_average:
        companyData.overview.current_company_metric_scores[3].raw_average,
      professional_development_and_training_name:
        companyData.overview.current_company_metric_scores[4].name,
      professional_development_and_training_company_metric_percentile:
        companyData.overview.current_company_metric_scores[4]
          .company_metric_percentile,
      professional_development_and_training_industry_position:
        companyData.overview.current_company_metric_scores[4].industry_position,
      professional_development_and_training_overall_position:
        companyData.overview.current_company_metric_scores[4].overall_position,
      professional_development_and_training_raw_average:
        companyData.overview.current_company_metric_scores[4].raw_average,
      inbound_lead_opportunity_flow_name:
        companyData.overview.current_company_metric_scores[5].name,
      inbound_lead_opportunity_flow_company_metric_percentile:
        companyData.overview.current_company_metric_scores[5]
          .company_metric_percentile,
      inbound_lead_opportunity_flow_industry_position:
        companyData.overview.current_company_metric_scores[5].industry_position,
      inbound_lead_opportunity_flow_overall_position:
        companyData.overview.current_company_metric_scores[5].overall_position,
      inbound_lead_opportunity_flow_raw_average:
        companyData.overview.current_company_metric_scores[5].raw_average,
      diversity_and_inclusion_name:
        companyData.overview.current_company_metric_scores[6].name,
      diversity_and_inclusion_company_metric_percentile:
        companyData.overview.current_company_metric_scores[6]
          .company_metric_percentile,
      diversity_and_inclusion_industry_position:
        companyData.overview.current_company_metric_scores[6].industry_position,
      diversity_and_inclusion_overall_position:
        companyData.overview.current_company_metric_scores[6].overall_position,
      diversity_and_inclusion_raw_average:
        companyData.overview.current_company_metric_scores[6].raw_average,
    };
    await sheet.addRows(0, [company]);

    await timeout(2000 + Math.floor(Math.random() * 2000));
    return company;
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

  let companies = [];

  for (let i = 0; i < slugs.length; i += 1) {
    let slug = slugs[i];

    let url = `https://www.repvue.com/_next/data/84vuMcqSI8wTEVgQv4mIe/en/companies/${slug}.json?slug=${slug}`;
    let company = await getListings(url, sheet);
    console.log(company);
  }
})();
