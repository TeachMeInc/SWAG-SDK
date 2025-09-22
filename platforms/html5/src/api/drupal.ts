// https://dev.shockwave.com/api/node/game/entity/alias?route=/gamelanding/mixagram

import config from '@/config';
import session from '@/session';
import utils from '@/utils';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface DrupalGame {
  nid: string;
  type: string;
  created: string;
  published_at: string;
  author: {
    uid: number;
    name: string;
    url: string;
    picture: string;
  };
  title: string;
  view_node: string;
  field_description: string;
  field_medium_description: string;
  field_short_description: string;
  field_primary_genre_export: {
    id: number;
    title: string;
    url: string;
  };
  field_quaternary_genre_export: null | {
    id: number;
    title: string;
    url: string;
  };
  field_quinary_genre_export: null | {
    id: number;
    title: string;
    url: string;
  };
  field_secondary_genre_export: null | {
    id: number;
    title: string;
    url: string;
  };
  field_tertiary_genre_export: null | {
    id: number;
    title: string;
    url: string;
  };
  field_game_instructions: string;
  field_game_tips_and_tricks: string;
  field_minumum_sys_requirement: string;
  field_technical_issue_copy: string;
  field_game_credits: string;
  field_frontpage_sort: string;
  field_first_release_date: string;
  field_keyword: string;
  field_product_sku: string;
  field_display_height: string;
  field_display_width: string;
  field_shockwave_game_id: string;
  field_old_url: string;
  field_daily_bonus_reference_export: null | any;
  field_game_markup_: string;
  field_keyword_small: string;
  field_keyword_regular: string;
  field_keyword_large: string;
  field_keyword_xl: string;
  field_keyholeheader: string;
  field_dynamic_feature: string;
  field_billboard_two: string;
  field_billboard_three: string;
  field_instructions_image: string;
  field_game_files_directory_path: string;
  field_is_this_a_daily_game_: string;
  field_does_this_game_have_a_bonu: string;
  field_is_this_a_bonus_daily_game: string;
  field_does_this_game_have_a_high: string;
  field_is_this_game_daily_jigsaw_: string;
  field_is_this_game_mobile_: string;
  field_show_huge_advert_: string;
  field_is_chat_enabled_: string;
  field_is_this_a_calendar_game_: string;
  field_is_shockwave_exclusive_: string;
  field_has_downloadable_purchase_: string;
  field_has_downloadable_trial_ver: string;
  field_has_online_version_: string;
  field_calendar_only_iframe_sourc: string;
  field_game_display_markup_fullsc: string;
  field_display_markup_premium: string;
  field_game_mkup_full_scripts: string;
  field_custom_game_button_one: string;
  field_custom_button_action_one: string;
  field_custom_game_button_action_: string;
  field_custom_game_button_two: string;
  field_custom_button_action_three: string;
  field_custom_game_button_three: string;
  field_dyn_button_one: string;
  field_dyn_button_one_url: string;
  field_dyn_button_two: string;
  field_dyn_button_two_url: string;
  field_dynld_url_one: string;
  field_dynld_url_two: string;
  field_dyn_lead_backup_image: string;
  field_dyn_lead_backup_image_two: string;
  field_is_this_a_downloadable_dai: string;
  field_is_this_game_create_and_sh: string;
  field_is_this_a_free_club_game_: string;
  field_is_club_exclusive_: string;
  field_is_this_game_virtual_goods: string;
  field_is_this_a_token_game_: string;
  field_is_this_a_trophy_game_: string;
  field_is_this_game_service_manag: string;
  field_is_the_game_multiplayer_: string;
  field_is_this_an_advert_game_: string;
  field_is_game_aws_active_: string;
  field_aggregate_game_rating: string;
  field_aggregate_rating_count: string;
  field_aggregate_rating_sum: string;
  totalcount: string;
  daycount: string;
  field_archive_start_date: string;
  field_archive_end_date: string;
  field_archive_start_day: string;
  field_archive_frequency: string;
  field_archive_value: string;
  field_does_this_game_have_thumbn: string;
  field_should_archive_display_hid: string;
  sw_paidgame_price: string;
  sw_game_download_url: string;
  sw_paidgame_buy_url: string;
  field_mobile_title_short: string;
  field_mobile_description_short: string;
  field_mobile_game_url: string;
  field_mobile_image: string;
  field_mobile_body: string;
  field_mobile_icon: string;
  field_alternate_game_suggestion: null | any;
  field_suggest_a_random_game: string;
  random_game_suggestion_endpoint: string;
  field_game_url: string;
  field_walkthroughs: string;
  field_swag_daily_level_key: string;
  field_swag_score_type: string;
  field_modern_game_url: string;
  field_use_landing_page: string;
  field_highlight_color: string;
}



// #region Axios Setup

let axiosInstance: AxiosInstance | null = null;

function getAxios (): AxiosInstance {
  if (axiosInstance) return axiosInstance;

  const baseURL = config.drupalRoot;
  axiosInstance = axios.create({
    baseURL,
    withCredentials: false,
    timeout: 15000,
  });

  axiosInstance.interceptors.request.use((req) => {
    // Always refresh baseURL in case theme changed at runtime
    req.baseURL = config.drupalRoot;
    req.headers = req.headers || {};
    req.headers[ 'Content-Type' ] = 'application/json';
    return req;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      // Central error logging
      utils.warn('API request failed', error?.response?.status, error?.message);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

async function getJSON<T> (url: string, params?: Record<string, any>, configOverride?: AxiosRequestConfig): Promise<T> {
  const client = getAxios();
  const response = await client.get(url, { params, ...configOverride });
  return response.data as T;
}

// async function postJSON<T> (url: string, body?: any, configOverride?: AxiosRequestConfig): Promise<T> {
//   const client = getAxios();
//   const response = await client.post(url, body, configOverride);
//   return response.data as T;
// }

// #endregion



class DrupalAPI {
  // events: {
  //   DATA_EVENT: 'DATA_EVENT',
  //   DATA_ERROR: 'DATA_ERROR',
  //   USER_LOGIN: 'USER_LOGIN',
  //   USER_LOGOUT: 'USER_LOGOUT'
  // }

  // #region Game Methods

  async getGame (keyword: string): Promise<DrupalGame> {
    const games = await getJSON<DrupalGame[]>('/api/node/game/entity/alias?route=/gamelanding/' + keyword);
    const game = games[ 0 ];

    session.game = { 
      ...(session.game!),
      hex_color: game.field_highlight_color!,
      icon_url: config.drupalRoot + game.field_mobile_icon!,
    };
    return game;
  }

  // #endregion
}

export default new DrupalAPI();
