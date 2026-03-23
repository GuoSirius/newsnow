import type { NewsItem } from "@shared/types"
import { defineSource } from "#/utils/source"

interface WeWeRSSItem {
  id: string
  title: string
  url: string
  date_modified: string
  image?: string
  content_html?: string
}

interface WeWeRSSResponse {
  version: string
  title: string
  description: string
  icon: string
  items: WeWeRSSItem[]
}

const fetchWechatFromRSS = defineSource(async () => {
  const baseUrl = "http://10.10.101.241:4000"
  const feedId = "MP_WXS_2224497781"
  const url = `${baseUrl}/feeds/${feedId}.json`

  const data: WeWeRSSResponse = await myFetch(url)

  const items: NewsItem[] = data.items.map(item => ({
    id: item.id,
    title: item.title,
    url: item.url,
    pubDate: item.date_modified,
    extra: {
      info: data.title,
      hover: item.date_modified,
      date: item.date_modified,
    },
  }))

  return items
})

export default defineSource({
  "rsswechat-tech": fetchWechatFromRSS,
})
