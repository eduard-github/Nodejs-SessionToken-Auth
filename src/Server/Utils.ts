import { parse } from 'url' 
export class Utils {
  public static getUrlBasePath(url: string | undefined): string {
    if(url) {
      const parseUrl = parse(url)
      return parseUrl.pathname!.replace('/', '')
    } else {
      return ''
    }
  }
}
