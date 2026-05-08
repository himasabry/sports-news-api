export default async function handler(req, res) {

  try {

    const rss =
    "https://news.google.com/rss/search?q=كرة+القدم&hl=ar&gl=EG&ceid=EG:ar";

    const response = await fetch(rss);

    const text = await response.text();

    const items =
    [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    let news = items.slice(0,15).map(item => {

      const block = item[1];

      const title =
      (block.match(/<title>(.*?)<\/title>/) || [])[1] || "";

      let rawDescription =
(block.match(/<description>(.*?)<\/description>/) || [])[1] || "";

/* تنظيف HTML */
rawDescription = rawDescription
.replace(/<!\[CDATA\[|\]\]>/g,'')
.replace(/<a[^>]*>.*?<\/a>/g,'')
.replace(/<[^>]+>/g,'')
.replace(/&lt;/g,'')
.replace(/&gt;/g,'')
.replace(/&amp;/g,'')
.trim();

const description =
rawDescription || "اضغط لقراءة تفاصيل الخبر";

      const pubDate =
      (block.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";

      return {

        title:
        title.replace(/<!\[CDATA\[|\]\]>/g,''),

        description:
        description
        .replace(/<[^>]*>/g,'')
        .replace(/<!\[CDATA\[|\]\]>/g,'')
        .slice(0,150),

        image:
        "https://images.unsplash.com/photo-1508098682722-e99c643e7485?q=80&w=1200",

        pubDate

      };

    });

    res.status(200).json({
      success: true,
      data: news
    });

  } catch (e) {

    res.status(200).json({
      success: true,
      data: [
        {
          title: "تعذر تحميل الأخبار حاليا",
          description: "حاول مرة أخرى لاحقًا",
          image:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200",
          pubDate: new Date()
        }
      ]
    });

  }

}
