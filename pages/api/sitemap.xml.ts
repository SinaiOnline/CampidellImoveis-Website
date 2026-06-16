// pages/api/sitemap.xml.ts

import siteConfig from "@/config";
import { API_TOKEN, API_URL } from "@/lib/api";
import { PropertySearchResult } from "@/types/property-search";
import { NextApiRequest, NextApiResponse } from "next";


export const config = {
  // this disables body parsing so we can return raw XML
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const url = `${API_URL}/properties/search?limit=0`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN,
      },
    });

    console.log(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const properties = (await response.json()) as PropertySearchResult;
    const domain = siteConfig.websiteDomain.replace(/\/$/, "");

    const staticRoutes = [
      "/",
      "/sobre",
      "/contato",
      "/anuncie-seu-imovel",
      "/favoritos",
      "/servicos",
      "/VENDA",
      "/ALUGUEL",
    ];

    const now = new Date().toISOString();

    const staticXml = staticRoutes
      .map((route) => {
        return `
          <url>
            <loc>${domain}${route}</loc>
            <lastmod>${now}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      })
      .join("");

    const propertyXml =
      properties.properties
        ?.map((p) => {
          const updated = new Date(p.update);
          const registered = new Date(p.cadastro);

          const lastModifiedDate = !isNaN(updated.getTime())
            ? updated
            : !isNaN(registered.getTime())
              ? registered
              : new Date();

          const lastModified = lastModifiedDate.toISOString();

          return `
            <url>
              <loc>${domain}/${p.offer_type}/${p.codimovel}</loc>
              <lastmod>${lastModified}</lastmod>
              <changefreq>daily</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("") ?? "";

    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticXml}
        ${propertyXml}
      </urlset>
    `.trim();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=3600",
    );
    res.status(200).send(xml);
  } catch (err) {
    console.error("Error building sitemap", err);
    res.status(500).send("Internal Server Error");
  }
}
