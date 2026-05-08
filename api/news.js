export default async function handler(req, res) {
  try {

    const url = "https://news.google.com/rss/search?q=كرة+القدم+الدوري+المصري&hl=ar&gl=EG&ceid=EG:ar";

    const response = await fetch(url);
    const text = await response.text();

    // تحويل RSS بسيط بدون مكتبات
    const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    const news = items.map(item => {

      const block = item[1];

      const title = (block.match(/<title>(.*?)<\/title>/) || [])[1] || "";
      const link = (block.match(/<link>(.*?)<\/link>/) || [])[1] || "";
      const pubDate = (block.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";

      return {
        title,
        link,
        pubDate
      };

    });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
