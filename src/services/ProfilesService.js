import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class ProfilesService {

  async getProfileById(profileId) {
    AppState.profile = null
    const res = await api.get('api/profiles/' + profileId)
    AppState.profile = res.data
    let profile = AppState.profile
    logger.log(AppState.profile.github.slice(0, 8))
    if (profile.github.length > 1 && profile.github.slice(0, 8) != 'https://') {
      AppState.profile.github = 'https://' + AppState.profile.github
    }
    if (profile.linkedin.length > 1 && profile.linkedin.slice(0, 8) != 'https://') {
      AppState.profile.linkedin = 'https://' + AppState.profile.linkedin
    }
    if (profile.resume.length > 1 && profile.resume.slice(0, 8) != 'https://')
      AppState.profile.resume = 'https://' + AppState.profile.resume
    else
      AppState.profile.resume = ''
    logger.log('[GETTING PROFILE BY ID]', AppState.profile)
  }

  async updateProfile(profileId, data) {
    const res = await api.put('account', data)
    logger.log('[updating profile]', res.data)
    AppState.profile = res.data
  }
}

export const profilesService = new ProfilesService()