import { SitemapStream, streamToPromise } from "sitemap";
import { NextApiRequest, NextApiResponse } from "next";

const sitemapHandler = async (
  _: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const urls = [
      { url: "/", changefreq: "daily", priority: 1 },
      { url: "/admin", changefreq: "monthly", priority: 0.7 },
      { url: "/profile", changefreq: "monthly", priority: 0.7 },
      { url: "/leaderboard", changefreq: "monthly", priority: 0.7 },
    ];

    const sitemap = new SitemapStream({
      hostname: "https://dapp-template-ten.vercel.app/",
    });
    urls.forEach((url) => sitemap.write(url));
    sitemap.end();

    const sitemapXml = await streamToPromise(sitemap).then((sm) =>
      sm.toString()
    );

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemapXml);
    res.end();
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server error");
  }
};

export default sitemapHandler;
