import logger from "@/utils/loggerUtil";
import { handleAuthorizationFailed } from "@/utils/navigationUtil";
import axios, { AxiosRequestConfig } from "axios";



class MailApi {
    protected baseUrl: string;

    constructor() {
      this.baseUrl = process.env.VUE_APP_API_URL + '/api/mail';
    }

    protected getConfig(token:string): AxiosRequestConfig{
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    }

    async sendMessage(from:string, to:string, subject:string, text:string, token:string) {
        try {
            const response = await axios.post(
                this.baseUrl,
                {
                    from: from,
                    to: to,
                    subject: subject,
                    text: text
                },
                this.getConfig(token)
            );
            // You might handle the response if needed
            logger.debug(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 403) {
                        handleAuthorizationFailed();
                    } else {
                        // Handle other HTTP errors
                        logger.error(`HTTP Error: ${error.response.status}`);
                    }
                } else {
                    // Handle other errors
                    logger.error("Request failed:", error.message);
                }
            }
    
            logger.fatal("MailAPI: ", error);
            throw error;
        }
    }
}

export default new MailApi();