import Parser from "rss-parser"
import dayjs from "dayjs"
import type { NewsItem } from "@shared/types"
import { defineSource } from "#/utils/source"

function wechatRSSFactory(feedId = "") {
  feedId = feedId ? `/${feedId}.xml` : ""

  return defineSource(async () => {
    const baseUrl = "http://10.10.101.241:4000"

    const url = `${baseUrl}/feeds${feedId}`

    const parser = new Parser()
    const feed = await parser.parseURL(url)

    const items: NewsItem[] = feed.items.map((item) => {
      const pubDate = item.pubDate ? dayjs(item.pubDate).format("YYYY-MM-DD HH:mm:ss") : ""

      return {
        id: item.link || "",
        title: item.title || "",
        url: item.link || "",
        pubDate,
        extra: {
          info: feed.title || "",
          hover: pubDate,
          date: pubDate,
        },
      }
    })

    return items
  })
}

const fetchWechatFromCailianshe = wechatRSSFactory("MP_WXS_3893127105")
const fetchWechatFromJimuxinwen = wechatRSSFactory("MP_WXS_2224497781")

export default defineSource({
  "rsswechat-cailianshe": fetchWechatFromCailianshe,
  "rsswechat-jimuxinwen": fetchWechatFromJimuxinwen,
})
