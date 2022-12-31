import { parse, UrlWithParsedQuery, UrlWithStringQuery } from 'url' 
export class Utils {

  public static getUrlBasePath(url: string | undefined): string {
    if(url) {
      const parseUrl = parse(url)
      return parseUrl.pathname!.replace('/', '')
    } else {
      return ''
    }
  }

  public static getUrlParams(url: string | undefined): UrlWithParsedQuery | undefined {
    if (url) {
      return parse(url, true)
    } else {
      return undefined 
    }
  }

}
