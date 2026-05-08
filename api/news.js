export default async function handler(req, res) {

  try {

    const rss =
    "https://news.google.com/rss/search?q=كرة+القدم&hl=ar&gl=EG&ceid=EG:ar";

    const response = await fetch(rss);
    const text = await response.text();

    const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    let news = items.map(item => {

      const block = item[1];

      const title =
      (block.match(/<title>(.*?)<\/title>/) || [])[1] || "";

      const link =
      (block.match(/<link>(.*?)<\/link>/) || [])[1] || "";

      const description =
      (block.match(/<description>(.*?)<\/description>/) || [])[1] || "";

      const pubDate =
      (block.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";

      return {
        title: title.replace(/<!\[CDATA\[|\]\]>/g, ""),
        description: description
          .replace(/<[^>]*>/g, "")
          .replace(/<!\[CDATA\[|\]\]>/g, "")
          .slice(0, 200),

        image:
        "https://images.unsplash.com/photo-1508098682722-e99c643e7485",

        link,
        pubDate
      };

    });

    // إزالة الفاضي
    news = news.filter(n => n.title);

    return res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });

  } catch (e) {

    return res.status(500).json({
      success: false,
      error: e.message
    });

  }

}
