import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"
class AdsService {

  async getSidebarAds() {
    // logger.log("getting ads")
    const res = await api.get('api/ads')
    AppState.sidebarAds = res.data
    logger.log('[GETTING ADS]', AppState.sidebarAds)
  }

  async getBannerAd() {
    const res = await api.get('api/ads?count=6')
    logger.log('[SIDEBAR ADS]', res.data)
    AppState.bannerAds = res.data

  }


}

export const adsService = new AdsService()