import logger from '@/utils/loggerUtil';
import { handleAuthorizationFailed, handlePageNotFound } from '@/utils/navigationUtil';
import axios, { AxiosRequestConfig } from 'axios';

class ApiWrapper<T> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }


  protected getConfig(token:string): AxiosRequestConfig{
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  async create(item: T, token:string): Promise<T> {
    try {
      const response = await axios.post(`${this.baseUrl}`, item, this.getConfig(token));
      return response.data;
    } catch (error) {
      logger.fatal("ApiWrapper: ", error)
      throw error;
    }
  }

  async readAll(token:string): Promise<T | null> {
    try {   
      const response = await axios.get(`${this.baseUrl}`, this.getConfig(token));
      return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            if (error.response && error.response.status === 404) {
              handlePageNotFound()
            }
            else if(error.response && error.response.status === 403){
              handleAuthorizationFailed()
            }
        }
      
        logger.fatal("ApiWrapper: ", error)
        throw error;
    }
  }
  
  async read(id: number, token:string): Promise<T | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`,this.getConfig(token));
      return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.status === 404) {
            handlePageNotFound()
          }
          else if(error.response && error.response.status === 403){
            handleAuthorizationFailed()
          }
        }
      
        logger.fatal("ApiWrapper: ", error)
        throw error;
    }
  }

  async update(item: T, token:string): Promise<T> {
    try {
      const response = await axios.put(`${this.baseUrl}`, item,this.getConfig(token));
      return response.data;
    } catch (error) {
      
      logger.fatal("ApiWrapper: ", error)
      throw error;
    }
  }

  async delete(id: number, token:string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, this.getConfig(token));
    } catch (error) {
      
      logger.fatal("ApiWrapper: ", error)
      throw error;
    }
  }
}

export default ApiWrapper;
