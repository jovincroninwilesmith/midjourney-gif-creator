import axios, { AxiosRequestConfig } from 'axios';
import * as querystring from 'node:querystring';

const API_URL = 'https://www.midjourney.com/api/app';
const AUTHORITY = 'www.midjourney.com';
const USER_AGENT = `Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1`;
const REFERER = 'https://www.midjourney.com/app/feed/all/';

interface midjourneyRequest {
  amount?: number;
  orderBy?: string;
  jobType?: string;
  jobStatus?: string;
  prompt?: string;
  dedupe?: boolean;
  refreshApi?: number;
  cookie?: string;
}

async function getMidjourneyApiData({
  amount = 50,
  orderBy = 'new',
  jobType = 'yfcc_upsample,cc12m_diffusion,yfcc_diffusion,latent_diffusion',
  jobStatus = 'completed',
  prompt,
  dedupe = true,
  refreshApi = 0,
  cookie
}: midjourneyRequest) {
  const query = querystring.stringify({
    amount,
    jobType,
    orderBy,
    jobStatus,
    dedupe,
    refreshApi
  });

  const url = `${API_URL}/recent-jobs/?${query}&prompt=${prompt}`;
  const config = {
    method: 'get',
    withCredentials: true,
    url,
    headers: {
      authority: AUTHORITY,
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      cookie: cookie,
      referer: REFERER,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent': USER_AGENT
    }
  } as AxiosRequestConfig;

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    return error;
  }
}

export { getMidjourneyApiData };
