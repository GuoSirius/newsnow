import { load } from "cheerio"
import type { NewsItem } from "@shared/types"
import { defineSource } from "#/utils/source"

const fetchWechatFromRSS = defineSource(async () => {
  const baseUrl = "http://10.10.101.241:4000/dash/feeds/"
  const html: string = await myFetch(`${baseUrl}MP_WXS_2224497781`)

  const $ = load(html)
  const items: NewsItem[] = []

  const account = $("h3").text().trim()

  $("table tbody tr").each((_, el) => {
    const $tds = $(el).find("td")

    const $a = $tds.eq(0).find("a")
    const title = $a.text().trim()
    const url = $a.attr("href") || ""

    const date = $tds.eq(1).text().trim()

    items.push({
      id: url,
      title,
      url: url.startsWith("http") ? url : `https://weixin.sogou.com${url}`,
      extra: { info: account, hover: date },
    })
  })

  return items
})

export default defineSource({
  "rsswechat-tech": fetchWechatFromRSS,
})
