import { load } from "cheerio"
import type { NewsItem } from "@shared/types"
import { defineSource } from "#/utils/source"

const fetchWechatFromSogou = defineSource(async () => {
  const baseUrl = "https://weixin.sogou.com/"
  const html: string = await myFetch(`${baseUrl}weixin?type=2&query=科技&ie=utf8`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Referer": baseUrl,
    },
  })

  const $ = load(html)
  const items: NewsItem[] = []

  $(".news-box .news-list li").each((_, el) => {
    const title = $(el).find("h3 a").text().trim()
    const url = $(el).find("h3 a").attr("href") || ""
    const account = $(el).find(".account").text().trim()
    const date = $(el).find(".s-p").text().trim()

    if (title && url) {
      items.push({
        id: url,
        title,
        url: url.startsWith("http") ? url : `https://weixin.sogou.com${url}`,
        extra: { info: account, hover: date },
      })
    }
  })

  return items
})

export default defineSource({
  "sougouwechat-tech": fetchWechatFromSogou,
})
