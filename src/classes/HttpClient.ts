import axios, { AxiosInstance, AxiosResponse } from 'axios';

export abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  /* istanbul ignore next */
  private _handleResponse = ({ data }: AxiosResponse) => data;
  
  /* istanbul ignore next */
  protected _handleError = (error: string): Promise<AxiosResponse> => Promise.reject(error);
}